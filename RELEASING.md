# Releasing

Releases for this repository are automated with
[semantic-release](https://semantic-release.gitbook.io/). It derives the next
version from the Conventional Commit messages since the last release, then:

- computes the next [SemVer](https://semver.org) version,
- generates release notes and updates `CHANGELOG.md`,
- creates the git tag and a matching GitHub Release,
- commits the updated `CHANGELOG.md` back to `main`,
- comments on the pull requests and issues included in the release.

Nothing is published to a package registry - these are shared schema artifacts,
so the release output is the git tag, the GitHub Release, and `CHANGELOG.md`.

## How the version is decided

The version bump is driven entirely by the commit types since the previous
release (see the [Conventional Commits](https://www.conventionalcommits.org)
spec and the repo's commit conventions in `CLAUDE.md` / `AGENTS.md`):

| Commit type                                              | Release |
| ------------------------------------------------------- | ------- |
| `fix:`                                                  | patch   |
| `feat:`                                                 | minor   |
| any type with `BREAKING CHANGE:` in the body / `!`      | major   |
| `chore:`, `docs:`, `refactor:`, `test:`, `ci:`, `style:` | none    |

If no commit since the last release warrants a version bump, semantic-release
makes no release. The first release this produces will be `v1.0.0`.

## One-time setup: add the workflow

The release runs from `.github/workflows/release.yml`. Add it once with the
content below (the automation bot that opened the PR cannot create workflow
files, so a maintainer with `workflows` permission must commit this file):

```yaml
---
name: Release

on:
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: release
  cancel-in-progress: false

jobs:
  release:
    runs-on: ubuntu-24.04
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6.0.3
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v6.4.0
        with:
          node-version: "24.15.0"

      - name: Install dependencies
        run: npm ci

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

## Triggering a release

Releases are triggered manually so they can be cut every few commits rather than
on every push:

1. Go to **Actions -> Release** in the GitHub UI.
2. Click **Run workflow** and select the `main` branch.
3. semantic-release runs `npx semantic-release`, and if there are releasable
   commits it publishes the tag, the GitHub Release, and the `CHANGELOG.md`
   update.

The workflow lives at `.github/workflows/release.yml` and is `workflow_dispatch`
only.

## Previewing locally (dry run)

You can preview what the next release would be without publishing anything:

```sh
task release:dry
# or, directly:
npm ci
npx semantic-release --dry-run --no-ci
```

The dry run prints the computed version and the release notes but never pushes,
tags, or creates a release.

## Configuration

| File                            | Purpose                                                              |
| ------------------------------- | ------------------------------------------------------------------- |
| `.releaserc.yaml`               | semantic-release config: release branch and plugin chain (YAML).    |
| `package.json` (`devDependencies`) | Pins semantic-release and its plugins; `npm ci` installs them.   |
| `.github/workflows/release.yml` | The `workflow_dispatch` job that runs semantic-release in CI.       |

The plugin chain in `.releaserc.yaml`:

1. `@semantic-release/commit-analyzer` - decides the release type (conventionalcommits preset).
2. `@semantic-release/release-notes-generator` - renders the release notes.
3. `@semantic-release/changelog` - writes the notes into `CHANGELOG.md`.
4. `@semantic-release/github` - creates the GitHub Release and comments on PRs/issues.
5. `@semantic-release/git` - commits the updated `CHANGELOG.md` back to `main`.

## Permissions and branch protection

The workflow runs with the built-in `GITHUB_TOKEN` and the job grants it
`contents: write`, `issues: write`, and `pull-requests: write`. That is enough
to tag, create the GitHub Release, comment, and push the `CHANGELOG.md` commit.

If `main` becomes a protected branch that requires pull requests or status
checks, the `@semantic-release/git` push of `CHANGELOG.md` will be rejected. In
that case either allow the release identity to bypass the protection rule, or
provide a token with bypass permission (a PAT or GitHub App token) as a secret
and pass it to the `Release` step as `GITHUB_TOKEN`. The release commit message
is `chore(release): <version> [skip ci]`, so it does not trigger CI.
