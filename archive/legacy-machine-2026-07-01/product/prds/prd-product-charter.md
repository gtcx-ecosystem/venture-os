---
id: prd-product-charter
title: Venture OS product charter
status: active
date: 2026-06-19
owner: venture-os
productGoalsRef: pm/spec/product-goals.json
milestones: [M1]
features:
  - venture-app-intake
  - venture-operations-desk
  - venture-collateral-workflows
  - venture-visibility-desk
  - venture-client-schema
---

# PRD — Venture OS

> **SoR:** Product vision and shippable scope. Roadmap stories trace via `pm/product/prd-index.json`.

## Vision

Venture OS productizes the GTCX fundraising engine into an Africa-focused founder command center — capital, growth, and visibility desks for founders, studios, accelerators, and ecosystem builders.

## Mission

Deliver an MVP app and operating playbooks so GTCX ecosystem repos are the first pilot venture profiles with demoable founder journeys in 2026-Q3.

## Product goals

| Goal | Metric | Target | Evidence |
| ---- | ------ | ------ | -------- |
| PG1 Founder command center MVP | App ship gate | `pnpm build` exit 0 | CI / local witness |
| PG2 GTCX ecosystem pilot profiles | Pilot journey | One intake → collateral path | `venture-pilot-journey-latest.json` |
| PG3 Governed fundraising workflows | Human gates | No autonomous external sends | culture + audit witnesses |

## GTM goals

| Goal | Motion | Outcome |
| ---- | ------ | ------- |
| GTM1 Ecosystem-first pilot | GR-T2-partial | GTCX repos as first venture profiles |

## Shipping goals (assurance — not product goals)

SoR: `pm/spec/product-goals.json#shippingGoals`.

| ID | Metric | Target | Evidence |
| -- | ------ | ------ | -------- |
| SG1 App build | pnpm build | exit 0 | app/.next/BUILD_ID |
| SG2 Product culture | fleet culture check | PASS | product-culture-fleet-latest.json |
| SG3 PRD trace | story → prdRef | 100% in-flight | prd-index |

## Target customers

| Segment | ICP | Buyer | Job to be done |
| ------- | --- | ----- | -------------- |
| Ecosystem pilot | GTCX product repos | Programme office | Model venture profile in Venture OS |
| External founder | African growth-stage founder | CEO / fundraising lead | Raise capital with governed workflows |

## Competition

| Alternative | Weakness | Our differentiation |
| ----------- | -------- | ------------------- |
| Generic CRM | No venture-studio discipline | Execution engine + human gates |
| Spreadsheets + Notion | No agent coordination | Agent prep with human approval on sends |

## Value proposition

**For** African founders and venture studios **who** need governed fundraising operations, **Venture OS** is a founder command center **that** turns messy opportunity flow into investable companies. **Unlike** generic CRMs, **we** embed GTCX pilot profiles and human-gated external actions.

## GTM

| Motion | Tier | Channel | Proof required |
| ------ | ---- | ------- | -------------- |
| Ecosystem pilot | GR-T2-partial | GTCX repos first | Demo routes + culture witness |
| Studio partners | GR-T3 | Accelerators | Pilot journey log |

## Features

1. `venture-app-intake` — Next.js intake routes and founder onboarding (capability: `founder-intake`).
2. `venture-operations-desk` — Operations desk for capital and growth workflows (capability: `capital-desk`).
3. `venture-collateral-workflows` — Collateral generation and review paths (capability: `collateral-workflows`).
4. `venture-visibility-desk` — Visibility desk for founder narrative and investor-facing surfaces (capability: `visibility-desk`).
5. `venture-client-schema` — Client profile schema (`schema/client.schema.json`) (capability: `client-profile-schema`).

## Success metrics

- Primary: MVP build green weekly
- Secondary: 1+ pilot journey witness per quarter
- Guardrails: no autonomous external investor sends

## Non-goals

- Replacing `fundraising/` internal GTCX office tooling in v1
- Autonomous legal or financial term commitment without human approval
- Generic global CRM feature parity

## Milestones

| Milestone | Shippable outcome | PRD status |
| --------- | ----------------- | ---------- |
| M1 (active) | MVP app + GTCX pilot shell with demo routes | active |

## Links

- Product goals: `pm/spec/product-goals.json`
- Legacy charter alias: `pm/product/prds/prd-venture-os-charter.md`
- Execution roadmap: `pm/execution-roadmap.md`
