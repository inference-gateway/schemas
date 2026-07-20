# Changelog

All notable changes to this project are documented in this file. See
[Conventional Commits](https://www.conventionalcommits.org) for commit guidelines.

## [0.7.0](https://github.com/inference-gateway/schemas/compare/v0.6.3...v0.7.0) (2026-07-20)

### Features

* **openapi:** add prompt_tokens_details and completion_tokens_details to CompletionUsage ([#130](https://github.com/inference-gateway/schemas/issues/130)) ([92b88ee](https://github.com/inference-gateway/schemas/commit/92b88ee0b6a2b568e484bca9232118a85f966b7d))

## [0.6.3](https://github.com/inference-gateway/schemas/compare/v0.6.2...v0.6.3) (2026-07-19)

### Bug Fixes

* **openapi:** correct Z.AI base URL to https://api.z.ai/api/paas/v4 ([#129](https://github.com/inference-gateway/schemas/issues/129)) ([c9189a2](https://github.com/inference-gateway/schemas/commit/c9189a22b5d0e7bbf5127e758ce723c97e322a1b))
* **openapi:** use bearer auth for llamacpp provider ([#128](https://github.com/inference-gateway/schemas/issues/128)) ([eca157f](https://github.com/inference-gateway/schemas/commit/eca157f5bf55e0f227c02cc9d7b5c27959803bb9))

## [0.6.2](https://github.com/inference-gateway/schemas/compare/v0.6.1...v0.6.2) (2026-07-18)

### Bug Fixes

* **release:** add refactor type to trigger patch release ([#126](https://github.com/inference-gateway/schemas/issues/126)) ([d4dbaaf](https://github.com/inference-gateway/schemas/commit/d4dbaaf85afd3427444099866815ff947719d2e5))

## [0.6.1](https://github.com/inference-gateway/schemas/compare/v0.6.0...v0.6.1) (2026-07-18)

### Bug Fixes

* **llamacpp:** set auth_type to none and default port to 8080 ([#123](https://github.com/inference-gateway/schemas/issues/123)) ([95e9039](https://github.com/inference-gateway/schemas/commit/95e9039740e08eaf959f902479ca93533b0f9ad8))

## [0.6.0](https://github.com/inference-gateway/schemas/compare/v0.5.1...v0.6.0) (2026-07-18)

### Features

* **openapi:** add llamacpp provider definition ([#122](https://github.com/inference-gateway/schemas/issues/122)) ([3872a4b](https://github.com/inference-gateway/schemas/commit/3872a4bd97373ffe5d785323c69865c9ece0c884))

## [0.5.1](https://github.com/inference-gateway/schemas/compare/v0.5.0...v0.5.1) (2026-07-08)

### Bug Fixes

* **openapi:** Add NVIDIA and ZAI env vars to x-config providers section ([#113](https://github.com/inference-gateway/schemas/issues/113)) ([46864ea](https://github.com/inference-gateway/schemas/commit/46864eaf40074406e353f5b4196e7a0159d89fed))

## [0.5.0](https://github.com/inference-gateway/schemas/compare/v0.4.0...v0.5.0) (2026-07-08)

### Features

* **openapi:** Add Z-AI provider ([#107](https://github.com/inference-gateway/schemas/issues/107)) ([8f40daa](https://github.com/inference-gateway/schemas/commit/8f40daadc7eff47e28ce391f59ec5d102f69a556))

## [0.4.0](https://github.com/inference-gateway/schemas/compare/v0.3.1...v0.4.0) (2026-07-08)

### Features

* declare the anthropic-version header via extra_headers ([#106](https://github.com/inference-gateway/schemas/issues/106)) ([a5b9f1e](https://github.com/inference-gateway/schemas/commit/a5b9f1e5a7e706e306017d6e12454c0f933cac6c)), references [inference-gateway/inference-gateway#428](https://github.com/inference-gateway/inference-gateway/issues/428)
* **openapi:** Add /v1/responses endpoint schema ([#67](https://github.com/inference-gateway/schemas/issues/67)) ([92464fd](https://github.com/inference-gateway/schemas/commit/92464fd640497ab8dc4faa49b5edce9754f88c7b))

### Bug Fixes

* **ci:** release notes are not being generated ([d99ebbf](https://github.com/inference-gateway/schemas/commit/d99ebbf0b094b46184909ff980d3fd2d38ee58a5))

## [0.3.1](https://github.com/inference-gateway/schemas/compare/v0.3.0...v0.3.1) (2026-07-05)

## [0.3.0](https://github.com/inference-gateway/schemas/compare/v0.2.0...v0.3.0) (2026-07-04)

## [0.2.0](https://github.com/inference-gateway/schemas/compare/v0.1.0...v0.2.0) (2026-06-18)

### Features

* **openapi:** Add MCP_INCLUDE_TOOLS/MCP_EXCLUDE_TOOLS config ([#79](https://github.com/inference-gateway/schemas/issues/79)) ([012b232](https://github.com/inference-gateway/schemas/commit/012b2328230e4ddae0df11b5150903d195c97c5c))
