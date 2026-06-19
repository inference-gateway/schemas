<div align="center">

# Inference Gateway Schemas

Source of truth for the shared schemas that power the Inference Gateway
ecosystem - the OpenAPI HTTP API spec, the A2A (Agent-to-Agent) protocol, and
the Model Context Protocol (MCP).

[![Build Status](https://img.shields.io/github/actions/workflow/status/inference-gateway/schemas/ci.yml?style=flat-square&logo=github&label=CI)](https://github.com/inference-gateway/schemas/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/inference-gateway/schemas?style=flat-square&logo=github)](https://github.com/inference-gateway/schemas/releases)

</div>

## Table of Contents

- [Overview](#overview)
- [Schemas](#schemas)
- [Layout](#layout)
- [Consumers](#consumers)
- [Development](#development)
- [Releases](#releases)
- [Contributing](#contributing)
- [License](#license)

## Overview

This repository holds the three shared schemas that the rest of the
Inference Gateway ecosystem consumes. Downstream projects regenerate from these
files, so a change here ripples into the gateway, the SDKs, the docs, the CLI,
and the operator.

Two kinds of files live here:

- **Sources of truth** are hand-edited here (`openapi.yaml`, `a2a/a2a.proto`).
- **Generated / mirrored** files are produced by the tasks below and should
  never be hand-edited - change the generator input (or upstream) and
  regenerate.

## Schemas

| Schema  | File(s)                                  | Editing                                                                                     |
| ------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| OpenAPI | `openapi.yaml`                           | **Hand-edited; source of truth** for the gateway's HTTP API.                                |
| A2A     | `a2a/a2a.proto` → `a2a/a2a-schema.{json,yaml}` | `a2a.proto` is the source of truth; the JSON/YAML are **generated** via `task a2a-schema-download`. |
| MCP     | `mcp/mcp-schema.{json,yaml}`             | **Mirrored** from [`modelcontextprotocol/modelcontextprotocol`](https://github.com/modelcontextprotocol/modelcontextprotocol) via `task mcp-schema-download`. |

## Layout

```text
.
├── openapi.yaml          # Inference Gateway HTTP API spec - source of truth
├── a2a/
│   ├── a2a.proto         # A2A protocol - source of truth
│   ├── a2a-schema.json   # generated from a2a.proto
│   └── a2a-schema.yaml   # generated from a2a.proto
├── mcp/
│   ├── mcp-schema.json   # mirrored from upstream MCP
│   └── mcp-schema.yaml   # mirrored from upstream MCP
└── scripts/              # A2A generation pipeline (Bun)
```

## Consumers

These schemas are consumed across the [`inference-gateway`](https://github.com/inference-gateway):

- [`inference-gateway`](https://github.com/inference-gateway/inference-gateway) - vendors `openapi.yaml` for Go code generation.
- [`sdk`](https://github.com/inference-gateway/sdk), [`python-sdk`](https://github.com/inference-gateway/python-sdk), [`rust-sdk`](https://github.com/inference-gateway/rust-sdk), [`typescript-sdk`](https://github.com/inference-gateway/typescript-sdk) - client SDKs generated from these schemas.
- [`docs`](https://github.com/inference-gateway/docs) - API reference and guides.
- [`operator`](https://github.com/inference-gateway/operator) and [`cli`](https://github.com/inference-gateway/cli) - consume the shared types.

## Development

The repository uses [Bun](https://bun.sh) as the runtime and package manager,
and all tasks run through [Task](https://taskfile.dev). You can use
[flox](https://flox.dev) for a consistent toolchain (configured in
`.flox/env/manifest.toml`).

```bash
# Install dependencies
bun install

# List every available task
task --list
```

Common tasks:

| Task                       | What it does                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `task openapi:lint`        | Spectral lint of `openapi.yaml` (runs in CI).                     |
| `task openapi:format`      | Format `openapi.yaml` with Prettier.                              |
| `task lint`                | Markdownlint over the Markdown files (runs in CI).               |
| `task format`              | Format the YAML schemas with Prettier.                           |
| `task a2a-schema-download` | Regenerate the A2A schema from `a2a/a2a.proto` (needs Go + buf). |
| `task mcp-schema-download` | Sync the MCP schema from upstream.                               |
| `task release:dry`         | Preview the next semantic-release version locally.               |

> See [`CLAUDE.md`](CLAUDE.md) / [`AGENTS.md`](AGENTS.md) for the full set of
> commands, the A2A generation pipeline, and contributor conventions.

## Releases

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/)
and triggered manually via the **Release** GitHub Actions workflow
(`workflow_dispatch`). The version is derived from the
[Conventional Commits](https://www.conventionalcommits.org) since the last
release, and each release updates [`CHANGELOG.md`](CHANGELOG.md), creates a git
tag, and publishes a GitHub Release. Nothing is published to a package registry.

## Contributing

- Use [Conventional Commits](https://www.conventionalcommits.org) - semantic-release
  derives versions from the commit history.
- Edit `openapi.yaml` directly; it is the source of truth.
- Never hand-edit generated or mirrored files (`a2a/a2a-schema.*`,
  `mcp/mcp-schema.*`) - change the generator input and rerun the task.

## License

Licensed under the [Apache License 2.0](LICENSE).
