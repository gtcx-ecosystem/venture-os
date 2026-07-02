---
title: "11PR audit — Tool Registry v1 + AI-native rolling brief"
status: current
date: 2026-06-17
owner: venture-os
document_type: audit-evidence
tier: critical
tags: ["11pr", "multi-pillar", "audit", "tool-registry", "venture-os"]
review_cycle: on-change
---

## Scope

This audit applies the **11PR multi-pillar model** (5 Foundation pillars + 6 Transformational pillars) to:

- **Tool Registry v1** (`docs/superpowers/specs/2026-06-17-tool-registry-design.md`)
- **Rolling Brief direction** (AI-native, power-user, world-class UX posture established in-session)

## Evidence

- Spec: `docs/superpowers/specs/2026-06-17-tool-registry-design.md` (commit `3bc832c`)
- Plan: `docs/superpowers/plans/2026-06-17-tool-registry-v1.md` (commit `8e80ef9`)
- App baseline: Next.js + TypeScript, rolling workspace patterns already present under `app/`

## Foundation tier (5)

| Pillar | Target for this scope | Current status | Gaps / Actions |
| ------ | ---------------------- | -------------- | -------------- |
| **Compliance** | Registry must carry compliance flags, licensing posture, and data residency so workflows can enforce “no outbound without approval” and “FOSS-first” constraints. | **Partial** (in schema) | Add `risk_tier` + `approval_required` rules per asset/workflow; add “policy constraints” in ranking API inputs. |
| **Technical Excellence** | Typed schema, dataset validation, deterministic ranking, tests, and stable IDs. | **Planned** | Execute plan tasks (Zod + Vitest + dataset tests + ranking tests). |
| **Craft** | Clean boundaries (`schema`, `dataset`, `ranking`, `workflows`), minimal surface area, no drift-prone numeric pricing. | **Good** | Keep vocab tight; add enum vocab for `categories` and `asset_types` (avoid free-form strings). |
| **World-class** | Power-user inspection UI, explainable ranking rationales, override/pinning path. | **Partial** | Implement `/tools` page; add “pin per workflow” (v1 may be read-only but should show where pins will live). |
| **Trust & Safety** | Explainability + replay: every selection produces rationale; approvals required for risky publishes; no silent tool execution. | **Partial** | Add “selection receipt” object (tool id + rank_score + rationale + constraints + timestamp + actor). |

## Transformational tier (6)

| Pillar | Target for this scope | Current status | Gaps / Actions |
| ------ | ---------------------- | -------------- | -------------- |
| **Creativity & Innovation** | Registry enables modular composition: swap ingestion/search/automation stacks; empower agent workflows. | **Good** | Add workflow presets for “news ingestion” + “brief generation” + “outreach.” |
| **Commercial Value Creation** | FOSS-first posture is explicit; registry supports managed service + enterprise later. | **Partial** | Add `commercial_notes` + `enterprise_readiness` tag (categorical) to support packaging without pricing drift. |
| **Defensive Moat Contribution** | Moat = tool choices + evidence + workflow graph; registry is a strategic catalog with audit history. | **Partial** | Persist selection receipts into the product ledger later; version the dataset (`tools.v1.json`). |
| **Agentic Empowerment & Orchestration** | Agents can request “best tool for job,” get governed options + rationale + constraints. | **Planned** | Implement `rankToolsForWorkflow()` and require constraints as first-class inputs; expose as callable function in the app layer. |
| **Product & Ecosystem Integration** | Registry ties into rolling brief, pipelines, approvals, calendar; connects to OSS rails (n8n, Miniflux, Keycloak, Postgres). | **Partial** | Add first workflow map for rolling brief: signals → enrich → approve → publish; list tool candidates per hop. |
| **IP that feels like magic** | “Ask what to do next” → tool selection + workflow queued + approvals + proof. | **Planned** | Define the selection receipt + approval gate surfaces; integrate into rolling brief after Tool Registry v1 ships. |

## Score snapshot (subjective; will update after implementation)

- **Foundation**: 3/5 “ready” (schema/plan strong; execution pending; safety receipts pending)
- **Transformational**: 2/6 “shipping” (direction strong; orchestration + integration pending)

## Next actions (audit-driven)

1. Implement Tool Registry v1 per plan tasks (schema + dataset + ranking + `/tools` inspection UI).
2. Add selection receipts + rationale surfaces (minimum viable “trust & safety” evidence).
3. Wire the registry into the Rolling Brief `/brief` route as the first AI-native orchestration consumer.

