---
title: "Tool Registry v1 — metadata + ranking schema (FOSS-first)"
status: draft
date: 2026-06-17
owner: venture-os
document_type: design
tier: critical
tags: ["venture-os", "ai-native", "integrations", "tool-registry", "ranking"]
---

## Summary

Venture OS needs a **tool registry** that can represent integrations (open source, free-tier, and paid) in a **durable, rankable, machine-readable** form.

This spec defines:

- A normalized `ToolRecord` schema with categorical pricing (no numeric costs).
- A scoring model (`quality_score` + `confidence`) plus computed `rank_score`.
- A workflow-facing query surface (“pick best tools for this job”) designed for AI-native orchestration.

## Goals

- **FOSS-first**: prioritize OSS/self-hostable tools by default while still allowing “free-tier” proprietary tools when unavoidable.
- **AI-native selection**: enable automated selection of the “best available” tool per workflow/task.
- **Power-user clarity**: tools are inspectable, explainable, and overridable.
- **Low drift**: avoid pricing drift by storing **categorical bands**, not dollars.

## Non-goals (v1)

- Perfect real-time pricing parity with vendor sites.
- Vendor onboarding/contract automation.
- Full dependency resolution (e.g., “tool X requires tool Y”) beyond lightweight notes.

## Definitions

- **Signals**: inbound sources (news, RSS, web, social) that generate opportunities and updates.
- **Systems of record**: CRM, calendar, docs, storage, etc.
- **Execution rails**: automation/workflow engines, publishing, comms channels.

## Data model

### `ToolRecord` (v1)

Required fields:

- **Identity**
  - `id` (stable slug)
  - `name`
  - `vendor`
  - `homepage`
  - `categories[]`

- **Platform**
  - `platforms[]`: `self_host | cloud | hybrid`
  - `deployment[]`: `docker | k8s | binary | managed`

- **Licensing**
  - `license_type`: `osi | fair_code | proprietary | open_data`
  - `license_spdx` (optional; when applicable)

- **Pricing (categorical)**
  - `pricing_model`: `free | freemium | paid | usage_based`
  - `free_tier.available`: `true | false | unknown`
  - `free_tier.limit_band`: `none | low | medium | high | unknown`
  - `free_tier.expires`: `true | false | unknown`
  - `cost_notes` (optional short text)

- **Quality score (0–100) + confidence**
  - `quality_score.reliability` (0–100)
  - `quality_score.security_posture` (0–100)
  - `quality_score.docs_quality` (0–100)
  - `quality_score.api_maturity` (0–100)
  - `quality_score.community_health` (0–100)
  - `quality_score.self_host_fit` (0–100)
  - `confidence` (0–1)
  - `last_verified` (ISO date string)

- **API**
  - `api.types[]`: `rest | graphql | webhook | rss | imap | smtp | oidc | s3 | sql | cli | sdk`
  - `api.auth[]`: `api_key | oauth2 | basic | jwt | session | mtls`
  - `api.webhooks`: `true | false | unknown`
  - `api.sdks[]`: `js | python | go | java` (optional)

- **Asset coverage**
  - `asset_types[]` (examples): `text | html | pdf | doc | sheet | slide | email | calendar_event | contact | company | deal | image | audio | video | web_article | rss_item | social_post`
  - `io_modes[]`: `ingest | enrich | transform | publish | archive`

- **Governance**
  - `compliance_flags[]` (optional; examples): `pii | financial | geo_sensitive`
  - `data_residency`: `configurable | fixed | unknown`

Optional fields:

- `integration_effort`: `low | med | high`
- `data_access`: `read | write | read_write`
- `recommended_for[]` (workflow slugs)
- `notes` (short text)

### Category vocabulary (initial)

- `automation`, `workflow_engine`
- `crm`
- `feeds`, `news_signals`, `search`, `scraping`
- `database`, `vector`, `bi`
- `storage`
- `email`, `calendar`, `docs`
- `media` (image/audio/video)
- `auth`
- `ai`

## Ranking model

### Inputs

- **FOSS posture**: prefer `license_type=osi` and `platforms` containing `self_host`.
- **Quality**: weighted sum of `quality_score.*`
- **Cost posture**: prefer `free` + `free_tier.available=true`
- **Integration friction**: prefer `integration_effort=low`
- **API capability**: prefer tools with `api.types` matching workflow requirements + `api.webhooks=true` where relevant.

### Output

For each workflow or action request, compute:

- `rank_score` (0–100)
- `rationale[]` (short strings explaining why it ranked)
- `fallbacks[]` (next best tools)

The ranking output must be **explainable** and **overrideable** by power users.

## Query surface (app-facing)

### `rankToolsForWorkflow(workflowId, constraints)`

Returns ranked tools, with constraints such as:

- `mustBeSelfHost` (bool)
- `allowFairCode` (bool)
- `needsWebhooks` (bool)
- `assetTypes[]`
- `ioModes[]`
- `maxIntegrationEffort` (`low|med|high`)

### `getToolById(id)`

Returns the record with metadata for inspection and debugging.

## UI implications (V1)

- A “Tools” settings screen:
  - searchable registry
  - badges for `license_type`, `platform`, `pricing_model`, `free_tier.limit_band`
  - visible `quality_score` (with sub-scores) + `last_verified`
  - “pin” a preferred tool per workflow (override ranking)

## Testing + validation (v1)

- JSON schema validation for `ToolRecord`.
- Deterministic ranking tests for known constraint sets.
- Snapshot tests for registry rendering and badge mapping.

## Open questions (tracked; not blocking v1)

- Whether to split `quality_score` into “vendor” vs “self-host ops” dimensions.
- How to normalize “limit_band” across wildly different free tiers.

