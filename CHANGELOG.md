# Changelog

All notable changes to this project are documented in this file. See
[Conventional Commits](https://www.conventionalcommits.org) for commit guidelines.

## [0.16.0](https://github.com/inference-gateway/schemas/compare/v0.15.3...v0.16.0) (2026-07-28)

### Features

* **openapi:** add output_config effort to CreateMessagesRequest ([#161](https://github.com/inference-gateway/schemas/issues/161)) ([8781701](https://github.com/inference-gateway/schemas/commit/8781701113d589dc1021a4ef0a915efbdf7d3d94))

### Improvements

* change commits to lowercase for consistency ([abacc20](https://github.com/inference-gateway/schemas/commit/abacc20b7dd3be72931acfaa85eff11e793d1cb9))

### Misc

* Sync MCP schema ([#160](https://github.com/inference-gateway/schemas/issues/160)) ([a361f44](https://github.com/inference-gateway/schemas/commit/a361f44b4d960fe49e3976ff0d6a869459b3c925))

## [0.15.3](https://github.com/inference-gateway/schemas/compare/v0.15.2...v0.15.3) (2026-07-28)

### Bug Fixes

* **release:** add refactor type to release notes under Improvements section ([#159](https://github.com/inference-gateway/schemas/issues/159)) ([f8be2ce](https://github.com/inference-gateway/schemas/commit/f8be2ce7f85ced394a781f43134d95438abc4f10))

## [0.15.2](https://github.com/inference-gateway/schemas/compare/v0.15.1...v0.15.2) (2026-07-28)

## [0.15.1](https://github.com/inference-gateway/schemas/compare/v0.15.0...v0.15.1) (2026-07-28)

## [0.15.0](https://github.com/inference-gateway/schemas/compare/v0.14.0...v0.15.0) (2026-07-27)

### Features

* **openapi:** add guardrails x-config section ([#156](https://github.com/inference-gateway/schemas/issues/156)) ([3396efb](https://github.com/inference-gateway/schemas/commit/3396efb5d8e18f783121e1a4b17ac10805f68c79))

## [0.14.0](https://github.com/inference-gateway/schemas/compare/v0.13.0...v0.14.0) (2026-07-27)

### Features

* **openapi:** add server max_request_body_size setting ([#153](https://github.com/inference-gateway/schemas/issues/153)) ([8640b13](https://github.com/inference-gateway/schemas/commit/8640b1313d087e46c26348d8680a4a2de3c75452))

### Bug Fixes

* **ci:** correct maintainer app ID reference in sync-downstream workflow ([d35b256](https://github.com/inference-gateway/schemas/commit/d35b256481b6521ceb3d97b2a883c2c84e7fd5d5))
* **ci:** update maintainer app ID to client ID in workflows and documentation ([bb7d397](https://github.com/inference-gateway/schemas/commit/bb7d39737fdc4b1e3decab6eec5b50878cce436b))

## [0.13.0](https://github.com/inference-gateway/schemas/compare/v0.12.0...v0.13.0) (2026-07-22)

### Features

* **openapi:** add routing config section (routing_enabled, routing_config_path) ([#147](https://github.com/inference-gateway/schemas/issues/147)) ([7529c8f](https://github.com/inference-gateway/schemas/commit/7529c8f481e6166ad1815b9042ffef93a9f9e8ab)), references [#490](https://github.com/inference-gateway/schemas/issues/490)

## [0.12.0](https://github.com/inference-gateway/schemas/compare/v0.11.1...v0.12.0) (2026-07-22)

### Features

* **openapi:** add telemetry tracing x-config entries ([#145](https://github.com/inference-gateway/schemas/issues/145)) ([5aa9349](https://github.com/inference-gateway/schemas/commit/5aa93497e57da634237cee498ce3690ff3ac6191)), references [#483](https://github.com/inference-gateway/schemas/issues/483)

## [0.11.1](https://github.com/inference-gateway/schemas/compare/v0.11.0...v0.11.1) (2026-07-21)

### Bug Fixes

* **openapi:** add x-enum-varnames to Messages API inline enums ([#143](https://github.com/inference-gateway/schemas/issues/143)) ([a7011e5](https://github.com/inference-gateway/schemas/commit/a7011e553e6771985e629a9cee89186e1fa13007))

## [0.11.0](https://github.com/inference-gateway/schemas/compare/v0.10.0...v0.11.0) (2026-07-21)

### Features

* **openapi:** add Anthropic Messages API (POST /v1/messages) endpoint ([#140](https://github.com/inference-gateway/schemas/issues/140)) ([f9ff6bc](https://github.com/inference-gateway/schemas/commit/f9ff6bc372e8bcac3d3321e69ccbe6a90b6d979d))

## [0.10.0](https://github.com/inference-gateway/schemas/compare/v0.9.0...v0.10.0) (2026-07-21)

### Features

* **openapi:** add subscription field to Pricing schema ([#138](https://github.com/inference-gateway/schemas/issues/138)) ([b18e6b8](https://github.com/inference-gateway/schemas/commit/b18e6b88f8c2a5dd292a303be23b2e562da0623d))

## [0.9.0](https://github.com/inference-gateway/schemas/compare/v0.8.0...v0.9.0) (2026-07-20)

### Features

* **openapi:** refactor include query param to typed enum array ([#136](https://github.com/inference-gateway/schemas/issues/136)) ([0b9f25a](https://github.com/inference-gateway/schemas/commit/0b9f25a1511c25b85e45afea8394f373fe6e4805))

## [0.8.0](https://github.com/inference-gateway/schemas/compare/v0.7.0...v0.8.0) (2026-07-20)

### Features

* **openapi:** add community to ContextWindow.source enum and sync Pricing.source ([#134](https://github.com/inference-gateway/schemas/issues/134)) ([dde94fb](https://github.com/inference-gateway/schemas/commit/dde94fba2c2a53ddfaccf67eeb6f71c38f117d9e))
* **openapi:** add context_window and pricing schemas with include query param ([#132](https://github.com/inference-gateway/schemas/issues/132)) ([3b26288](https://github.com/inference-gateway/schemas/commit/3b26288f91333f6c1f44143bedfd44fab2e5d1e9))

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
