# Repository Guidelines

Shared schemas for the Inference Gateway ecosystem. Downstream projects (gateway, SDKs, docs, CLI, operator) regenerate from these files, so every change ripples — call out downstream impact in PRs.

- `openapi.yaml` — the gateway's HTTP API. **Hand-edited; source of truth.**
- `a2a/a2a.proto` — A2A types, source of truth; `a2a/a2a-schema.{json,yaml}` are **generated** from it.
- `mcp/mcp-schema.{json,yaml}` — **mirrored** from upstream `modelcontextprotocol/modelcontextprotocol`.

## Commands

Runtime is Bun (`>= 1.3.13`); run `bun install` first. Everything goes through Task (`task --list`).

| Task                       | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `task openapi:lint`        | Spectral lint of `openapi.yaml` (CI gate).                                  |
| `task openapi:format`      | Prettier-format `openapi.yaml`.                                              |
| `task lint` / `lint:fix`   | markdownlint over Markdown, minus `.markdownlintignore` (`AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `node_modules/`). `lint` is a CI gate. |
| `task check-reachable`     | Asserts streaming-payload schemas stay reachable (oapi-codegen drops unreachable ones). |
| `task a2a-schema-download` | Regenerates `a2a/a2a-schema.{json,yaml}` from the proto. Requires Go + `buf`. |
| `task mcp-schema-download` | Re-syncs the MCP schema from upstream.                                      |
| `task release:dry`         | Previews the next semantic-release version and notes; publishes nothing. Needs `GITHUB_TOKEN`/`GH_TOKEN` exported. |

## Validation

There is no unit-test suite. CI (`.github/workflows/ci.yml`) runs only `bun run lint` and `bun run openapi:lint`. When touching streaming response schemas, also run `task check-reachable`; when touching `a2a.proto` or `scripts/`, run `task a2a-schema-download` end to end and diff the output against `main`.

## Style

Follow `.editorconfig` / `.prettierrc`: LF endings, UTF-8, final newline, trimmed trailing whitespace, 2-space indent (YAML and Markdown), single quotes. Keep schema names descriptive and stable — downstream code generators consume them verbatim.

## Commits & releases

Conventional Commits with an all-lowercase description (`feat(openapi): add usage fields`). Releases are automated by semantic-release (`.releaserc.yaml`, manual `Release` workflow in `.github/workflows/release.yml`): `feat:` → minor, a `BREAKING CHANGE:` footer → major, and `fix:`, `chore:`, `ci:`, `refactor:`, `perf:` and reverts → patch (the `releaseRules` in `.releaserc.yaml` plus the commit-analyzer defaults). Of the configured types only `docs:`, `style:`, `test:` and `build:` do not cut a release - a batch of `chore`/`ci` commits alone still ships a patch version.

## Adding a provider

Update `openapi.yaml` in three places. None of the three lists is alphabetical - each carries an early alphabetical-ish block followed by providers appended as they landed - so append the new provider at the end of every list rather than re-sorting (re-sorting churns the generated downstream SDKs for no gain):

1. **Provider enum** — add the name to the `Provider` schema's `enum` list.
2. **`x-provider-configs`** — add an entry with `id`, `url`, `auth_type`, and `endpoints` under the `Provider` schema.
3. **`x-config.providers`** — add `{provider}_api_url` (its `default` must match the `x-provider-configs` `url`) and `{provider}_api_key` (`secret: true`).

Env vars follow `{UPPER_SNAKE_PROVIDER}_API_URL` / `_API_KEY`.

## Gotchas

- Never hand-edit generated or mirrored outputs (`a2a/a2a-schema.*`, `mcp/mcp-schema.*`) — change the source and rerun the task. For A2A the source is the committed `a2a/a2a.proto`; the task never fetches it, so upstream changes have to be copied in by hand (or the task changed to fetch them).
- `a2a/*` is CODEOWNERS-protected; expect review from `@inference-gateway/a2a`.
- Only `task mcp-schema-download` downloads an upstream schema; `task a2a-schema-download` downloads just `buf.yaml` and the `protoc-gen-jsonschema@latest` plugin, then regenerates from the local proto. Review generated diffs carefully before merging.
- Do not commit local `.infer/` or temporary files. The flox environment **is** tracked (`.flox/env/manifest.toml` + `manifest.lock`, `.flox/env.json`) - toolchain bumps change those files on purpose; only the flox runtime dirs are local, and `.flox/.gitignore` already excludes them (`run/`, `cache/`, `lib/`, `log/`).
- The A2A generation pipeline internals (the `scripts/` stages) are documented in `CLAUDE.md`.