# schemas

This repository contain the different schemas like MCP, A2A, OpenAPI

## Releases

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/)
and triggered manually via the **Release** GitHub Actions workflow
(`workflow_dispatch`). The version is derived from the
[Conventional Commits](https://www.conventionalcommits.org) since the last
release, and each release updates [`CHANGELOG.md`](CHANGELOG.md), creates a git
tag, and publishes a GitHub Release. See [RELEASING.md](RELEASING.md) for the
full process and how to preview a release locally.
