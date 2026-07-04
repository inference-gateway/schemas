# Repository Guidelines

## Project Structure & Module Organization

This repository stores shared schema artifacts for the Inference Gateway ecosystem. `openapi.yaml` is the hand-edited source of truth for the HTTP API. `a2a/a2a.proto` is the source for A2A types; `a2a/a2a-schema.json` and `a2a/a2a-schema.yaml` are generated. `mcp/mcp-schema.json` and `mcp/mcp-schema.yaml` mirror the upstream Model Context Protocol schema. Helper scripts live in `scripts/`, automation in `Taskfile.yml`, and CI workflows in `.github/workflows/`.

## Build, Test, and Development Commands

Use Taskfile tasks for routine work:

- `task --list` lists available tasks.
- `task openapi:format` formats `openapi.yaml` with Prettier.
- `task openapi:lint` runs Spectral against `openapi.yaml`; this is the CI check.
- `task mcp-schema-download` fetches the latest upstream MCP schema and regenerates YAML.
- `task a2a-schema-download` regenerates A2A JSON/YAML from `a2a/a2a.proto`; it requires Go and `buf`.
- `task release:dry` previews the next semantic-release version and notes without publishing.

For OpenAPI codegen reachability checks, run `bun scripts/check-reachable.js openapi.yaml`.

## Coding Style & Naming Conventions

Follow `.editorconfig`: LF endings, UTF-8, final newline, and trimmed trailing whitespace. Markdown and YAML use 2-space indentation. Prettier is configured for single quotes. Keep schema names descriptive and stable because downstream SDKs, docs, and code generators consume these files directly.

## Testing Guidelines

There is no broad unit test suite. Validate OpenAPI changes with `task openapi:lint` and, when touching streaming response schemas, `bun scripts/check-reachable.js openapi.yaml`. For A2A generation changes, run `task a2a-schema-download` end to end and inspect the generated diff. Do not hand-edit generated schema outputs unless the corresponding task or source file requires it.

## Commit & Pull Request Guidelines

Use Conventional Commits with a capitalized description, matching project history, for example `chore: Sync MCP schema` or `feat(openapi): Add usage fields`. These commit types drive semantic-release: `feat:` triggers a minor release, `fix:` a patch, and a `BREAKING CHANGE:` footer a major; see `RELEASING.md`. PRs should describe the schema impact, list validation commands run, and call out downstream effects for SDKs, docs, or gateway code. A2A changes touch CODEOWNERS-managed paths, so expect review from `@inference-gateway/a2a`.

## Security & Configuration Tips

Do not commit local `.infer/`, `.flox/`, or generated temporary files. Schema sync tasks download upstream content; review generated diffs carefully before merging automated or manual sync updates.
