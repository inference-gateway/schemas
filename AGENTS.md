# AGENTS.md

Shared schemas for the Inference Gateway ecosystem. Downstream projects (gateway, SDKs, docs, CLI, operator) regenerate from these files, so every change ripples - call out downstream impact in PRs (the SDK repos `inference-gateway/sdk`, `python-sdk`, `rust-sdk`, `typescript-sdk`, plus `inference-gateway/docs` and `inference-gateway/inference-gateway`).

- `openapi.yaml` - the gateway's HTTP API. **Hand-edited; source of truth.**
- `a2a/a2a.proto` - A2A types, source of truth; `a2a/a2a-schema.{json,yaml}` are **generated** from it.
- `mcp/mcp-schema.{json,yaml}` - **mirrored** from upstream `modelcontextprotocol/modelcontextprotocol`.

## Commands

Runtime is Bun (`>= 1.3.13`); run `bun install` first. Everything goes through Task (`task --list`).

| Task                       | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `task openapi:lint`        | Spectral lint of `openapi.yaml` (CI gate).                                  |
| `task openapi:format`      | Prettier-format `openapi.yaml`.                                              |
| `task lint` / `lint:fix`   | markdownlint over Markdown, minus `.markdownlintignore` (`AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `node_modules/`). `lint` is a CI gate. |
| `task check-reachable`     | Asserts streaming-payload schemas (`CreateChatCompletionStreamResponse` and friends) stay reachable from operations; oapi-codegen drops unreachable ones (issue #31). |
| `task a2a-schema-download` | Regenerates `a2a/a2a-schema.{json,yaml}` from the proto. Requires Go + `buf`. |
| `task mcp-schema-download` | Re-syncs the MCP schema for the pinned protocol version (`MCP_PROTOCOL_VERSION` in `Taskfile.yml`); bump the pin when a new revision ships. |
| `task release:dry`         | Previews the next semantic-release version and notes; publishes nothing. Needs `GITHUB_TOKEN`/`GH_TOKEN` exported and push access to `main` (it still runs `git push --dry-run` and the GitHub verifyConditions check, which fails with `ENOGHTOKEN` without a token). |

The two schema-sync tasks are also `workflow_dispatch` workflows (`a2a-schema-sync.yml`, `mcp-schema-sync.yml`) that open a `chore(scope): sync ...` PR.

## Validation

There is no unit-test suite; the sync workflows are the regression net for generated schemas. CI (`.github/workflows/ci.yml`) runs only `bun run lint` and `bun run openapi:lint`, on pushes to `main` and PRs targeting `main` - pushes to other branches without an open PR are not built. When touching streaming response schemas, also run `task check-reachable`; when touching `a2a.proto` or `scripts/`, run `task a2a-schema-download` end to end and diff the output against `main` - it is load-bearing for SDK codegen.

## Style

Follow `.editorconfig` / `.prettierrc`: LF endings, UTF-8, final newline, trimmed trailing whitespace, 2-space indent (YAML and Markdown), single quotes. Keep schema names descriptive and stable - downstream code generators consume them verbatim.

### Code Readability

- Write self-explanatory code: clear names and small, single-purpose functions carry the intent.
  If a block needs a comment to be understood, extract it into a well-named function or variable.
- No inline comments inside function bodies.
- Doc comments on functions, types, and modules are at most 5 lines: what it does and why, not how.
- Tool directives are not comments and stay where the tool needs them (lint suppressions, build
  tags, compiler pragmas, code generation markers).

## Commits & releases

Conventional Commits with an all-lowercase description (`feat(openapi): add usage fields`); semantic-release depends on it. Releases are automated by semantic-release (`.releaserc.yaml`, manual `Release` workflow in `.github/workflows/release.yml`), which updates `CHANGELOG.md`, tags, and creates a GitHub Release - nothing is published to a package registry. `feat:` -> minor, a `BREAKING CHANGE:` footer -> major, and `fix:`, `chore:`, `ci:`, `refactor:`, `perf:` and reverts -> patch (the `releaseRules` in `.releaserc.yaml` plus the commit-analyzer defaults). Of the configured types only `docs:`, `style:`, `test:` and `build:` do not cut a release - a batch of `chore`/`ci` commits alone still ships a patch version.

## Adding a provider

Update `openapi.yaml` in three places. None of the three lists is alphabetical - each carries an early alphabetical-ish block followed by providers appended as they landed - so append the new provider at the end of every list rather than re-sorting (re-sorting churns the generated downstream SDKs for no gain):

1. **Provider enum** - add the name to the `Provider` schema's `enum` list.
2. **`x-provider-configs`** - add an entry with `id`, `url`, `auth_type`, and `endpoints` under the `Provider` schema.
3. **`x-config.providers`** - add `{provider}_api_url` (its `default` must match the `x-provider-configs` `url`) and `{provider}_api_key` (`secret: true`).

Env vars follow `{UPPER_SNAKE_PROVIDER}_API_URL` / `_API_KEY`.

## A2A generation pipeline

`task a2a-schema-download` runs three stages over the committed `a2a/a2a.proto`; the `scripts/` stages do what `buf`/`protoc-gen-jsonschema` alone can't (`scripts/sort-keys.js` gives both scripts deterministic key order; `check-reachable.js` belongs to `openapi.yaml`, not A2A).

1. **`buf generate`** - emits per-message `*.jsonschema.strict.bundle.json` files into `a2a/` (`target=json-strict-bundle`).
2. **`scripts/process-bundle.js`** - merges the bundles into one `a2a-schema.{json,yaml}` under `definitions:`, then strips MkDocs `--8<-- [start:X]` / `[end:X]` snippet markers from descriptions; strips the `a2a.v1.` and `google.protobuf.` prefixes from definition keys **and** `$ref`s (only those two - an upstream package rename such as `lf.a2a.v1` needs this script updated); rewrites `#/$defs/` -> `#/definitions/`; deletes `patternProperties` (downstream codegen can't handle them); and removes the bundle files.
3. **`scripts/add-required-fields.js`** - uses `scripts/parse-proto-required.js` to read `[(google.api.field_behavior) = REQUIRED]` annotations (`{ MessageName: [camelCaseField, ...] }`) and writes them into both outputs. The plugin already emits a presence-derived `required` array, so this stage **overwrites** it for annotated messages while unannotated definitions keep the plugin's array - that mismatch is a bug, tracked in #249.

## Gotchas

- Never hand-edit generated or mirrored outputs (`a2a/a2a-schema.*`, `mcp/mcp-schema.*`) - change the source and rerun the task. For MCP, fix upstream rather than patching locally. For A2A the source is the committed `a2a/a2a.proto`; the task never fetches it, so upstream (`a2aproject/A2A`, `specification/a2a.proto`) changes have to be copied in by hand (or the task changed to fetch them).
- `a2a/*` is CODEOWNERS-protected; expect review from `@inference-gateway/a2a`.
- Only `task mcp-schema-download` downloads an upstream schema; `task a2a-schema-download` downloads just `buf.yaml` and the `protoc-gen-jsonschema@latest` plugin, then regenerates from the local proto. Review generated diffs carefully before merging.
- Do not commit local `.infer/` or temporary files. The flox environment **is** tracked (`.flox/env/manifest.toml` + `manifest.lock`, `.flox/env.json`) - toolchain bumps change those files on purpose; only the flox runtime dirs are local, and `.flox/.gitignore` already excludes them (`run/`, `cache/`, `lib/`, `log/`).
