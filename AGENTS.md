# AGENTS.md

Shared schemas for the Inference Gateway ecosystem. Downstream projects (gateway, SDKs, ADKs, docs, CLI, operator) regenerate from these files, so every change ripples - call out downstream impact in PRs (the SDK repos `inference-gateway/sdk`, `python-sdk`, `rust-sdk`, `typescript-sdk`, the ADK repos `inference-gateway/adk`, `rust-adk`, `typescript-adk`, plus `inference-gateway/docs` and `inference-gateway/inference-gateway`).

- `openapi.yaml` - the gateway's HTTP API. **Hand-edited - source of truth.**
- `a2a/a2a.proto` - A2A types, **mirrored** from upstream `a2aproject/A2A` at the `A2A_REF` pin in `Taskfile.yml`.
- `a2a/a2a-jsonrpc.proto` - **hand-written** JSON-RPC binding types (`A2AMethod`, `JSONRPCRequest`, `JSONRPCSuccessResponse`, `JSONRPCErrorResponse`, `JSONRPCError`) that the official proto does not model - the only place for non-official A2A types.
- `a2a/a2a-schema.{json,yaml}` - **generated** from both protos - downstream ADKs generate their types from it and keep no hand-written copies.
- `a2a/extensions/<name>/v<N>/README.md` - **hand-written** specs of our A2A extensions. The directory's GitHub tree URL is the extension URI, so never move or rename a published one - a breaking change gets a new `v<N>`.
- `mcp/mcp-schema.{json,yaml}` - **mirrored** from upstream `modelcontextprotocol/modelcontextprotocol`.

The `maintainer` skill (if loaded) documents cross-repo conventions for the `inference-gateway` polyrepo - read it before fan-out or breaking changes.

## Commands

Runtime is Bun (`>= 1.3.13`) - run `bun install` first. Everything goes through Task (`task --list`).

| Task                       | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `task openapi:lint`        | Spectral lint of `openapi.yaml` (CI gate).                                  |
| `task openapi:format`      | Prettier-format `openapi.yaml`.                                              |
| `task lint` / `lint:fix`   | markdownlint over Markdown, minus `.markdownlintignore` (`AGENTS.md`, `CHANGELOG.md`, `node_modules/`). `lint` is a CI gate. |
| `task check-reachable`     | Asserts streaming-payload schemas (`CreateChatCompletionStreamResponse` and friends) stay reachable from operations - oapi-codegen drops unreachable ones (issue #31). |
| `task a2a-schema-download` | Downloads `a2a/a2a.proto` at `A2A_REF` (default: the pinned tag) and regenerates `a2a/a2a-schema.{json,yaml}` from it and `a2a/a2a-jsonrpc.proto`. Requires Go + `buf`. |
| `task mcp-schema-download` | Re-syncs the MCP schema for the pinned protocol version (`MCP_PROTOCOL_VERSION` in `Taskfile.yml`) - bump the pin when a new revision ships. |
| `task release:dry`         | Previews the next semantic-release version and notes - publishes nothing. Needs `GITHUB_TOKEN`/`GH_TOKEN` exported and push access to `main` (it still runs `git push --dry-run` and the GitHub verifyConditions check, which fails with `ENOGHTOKEN` without a token). |

The two schema-sync tasks are also `workflow_dispatch` workflows (`a2a-schema-sync.yml`, `mcp-schema-sync.yml`) that open a `chore(scope): sync ...` PR.

## Validation

There is no unit-test suite - the sync workflows are the regression net for generated schemas. CI (`.github/workflows/ci.yml`) runs only `bun run lint` and `bun run openapi:lint`, on pushes to `main` and PRs targeting `main` - pushes to other branches without an open PR are not built. When touching streaming response schemas, also run `task check-reachable` - when touching `a2a.proto` or `scripts/`, run `task a2a-schema-download` end to end and diff the output against `main` - it is load-bearing for SDK codegen.

## Style

Follow `.editorconfig` / `.prettierrc`: LF endings, UTF-8, final newline, trimmed trailing whitespace, 2-space indent (YAML and Markdown), single quotes. Keep schema names descriptive and stable - downstream code generators consume them verbatim.

### Code Readability

- Write self-explanatory code: clear names and small, single-purpose functions carry the intent.
  If a block needs a comment to be understood, extract it into a well-named function or variable.
- No inline comments inside function bodies.
- Doc comments on functions and types are at most 5 lines: what it does and why, not how.
- No comments above modules, packages, or files.
- Tool directives are not comments and stay where the tool needs them (lint suppressions, build
  tags, compiler pragmas, code generation markers).
- No semicolons in documentation prose (Markdown files, doc comments): split the sentence or use
  a dash instead.

## Commits & releases

Conventional Commits with an all-lowercase description (`feat(openapi): add usage fields`) - semantic-release depends on it. Releases are automated by semantic-release (`.releaserc.yaml`, manual `Release` workflow in `.github/workflows/release.yml`), which updates `CHANGELOG.md`, tags, and creates a GitHub Release - nothing is published to a package registry. `feat:` -> minor, a `BREAKING CHANGE:` footer -> major, and `fix:`, `chore:`, `ci:`, `refactor:`, `docs:`, `perf:` and reverts -> patch (the `releaseRules` in `.releaserc.yaml` plus the commit-analyzer defaults). Of the configured types only `style:`, `test:` and `build:` do not cut a release - a batch of `chore`/`ci`/`docs` commits alone still ships a patch version. `docs:` ships because hand-written specs such as the A2A extensions under `a2a/extensions/` are part of the published schemas.

## Adding a provider

Update `openapi.yaml` in three places. None of the three lists is alphabetical - each carries an early alphabetical-ish block followed by providers appended as they landed - so append the new provider at the end of every list rather than re-sorting (re-sorting churns the generated downstream SDKs for no gain):

1. **Provider enum** - add the name to the `Provider` schema's `enum` list.
2. **`x-provider-configs`** - add an entry with `id`, `url`, `auth_type`, and `endpoints` under the `Provider` schema.
3. **`x-config.providers`** - add `{provider}_api_url` (its `default` must match the `x-provider-configs` `url`) and `{provider}_api_key` (`secret: true`).

Env vars follow `{UPPER_SNAKE_PROVIDER}_API_URL` / `_API_KEY`.

## A2A generation pipeline

`task a2a-schema-download` downloads `a2a/a2a.proto`, `buf.yaml` and `buf.lock` from `a2aproject/A2A` at `A2A_REF`, then runs four stages over it and the hand-written `a2a/a2a-jsonrpc.proto` - the `scripts/` stages do what `buf`/`protoc-gen-jsonschema` alone can't (`scripts/sort-keys.js` gives both scripts deterministic key order - `check-reachable.js` belongs to `openapi.yaml`, not A2A).

1. **`buf generate`** - emits per-message `*.jsonschema.strict.bundle.json` files into `a2a/` (`target=json-strict-bundle`).
2. **`scripts/process-bundle.js`** - merges the bundles into one `a2a-schema.{json,yaml}` under `definitions:`, then strips MkDocs `--8<-- [start:X]` / `[end:X]` snippet markers from descriptions (upstream dropped them in v1.0.1, so this is currently a no-op kept for future revisions) - strips the `lf.a2a.v1.` and `google.protobuf.` prefixes from definition keys **and** `$ref`s (only those two - a further upstream package rename needs this script updated) - rewrites `#/$defs/` -> `#/definitions/` - deletes `patternProperties` (downstream codegen can't handle them) - and removes the bundle files.
3. **`scripts/add-required-fields.js`** - uses `scripts/parse-proto-required.js` to read `[(google.api.field_behavior) = REQUIRED]` annotations from both protos (`{ MessageName: [camelCaseField, ...] }`) and writes them into both outputs. The plugin also emits a presence-derived `required` array, so `required` ends up derived solely from the annotations - this stage **overwrites** it for annotated messages and **deletes** the plugin's array from every other definition.
4. **`scripts/check-methods.js`** - fails the sync when the hand-written `A2AMethod` enum in `a2a/a2a-jsonrpc.proto` no longer matches the rpc names of the official `service A2AService` (A2A v1.0 uses them verbatim as JSON-RPC method names, spec section 5.3). When upstream adds or renames an rpc, update the enum.

## Gotchas

- Never hand-edit generated or mirrored outputs (`a2a/a2a-schema.*`, `mcp/mcp-schema.*`) - change the source and rerun the task. For MCP, fix upstream rather than patching locally. For A2A the source is upstream `a2aproject/A2A` `specification/a2a.proto` - the task fetches it at `A2A_REF`, so bump the pin in `Taskfile.yml` (or dispatch the sync workflow with `a2a_ref`) to pick up a new release. The committed proto is a verbatim copy of upstream tag `v1.0.1` - no local deviations.
- `a2a/*` is CODEOWNERS-protected - expect review from `@inference-gateway/a2a`.
- Every A2A generation input is pinned: the proto, `buf.yaml` and `buf.lock` come from the same `A2A_REF`, and `protoc-gen-jsonschema` is pinned in `Taskfile.yml`. Bump them together and review generated diffs carefully before merging.
- Do not commit local `.infer/` or temporary files. The flox environment **is** tracked (`.flox/env/manifest.toml` + `manifest.lock`, `.flox/env.json`) - toolchain bumps change those files on purpose - only the flox runtime dirs are local, and `.flox/.gitignore` already excludes them (`run/`, `cache/`, `lib/`, `log/`).
