---
id: prd-venture-os-charter
title: Venture OS product charter
status: draft
date: 2026-06-17
owner: venture-os
productGoalsRef: machine/spec/product-goals.json
milestones: [M1]
features: []
---

# PRD — Venture OS

> **SoR:** Product vision and shippable scope. Roadmap stories trace via `machine/product/prd-index.json`.

## Vision

Venture OS productizes the GTCX fundraising engine into an Africa-focused founder command center — capital, growth, and visibility desks for founders, studios, accelerators, and ecosystem builders.

## Mission

Deliver an MVP app and operating playbooks so GTCX ecosystem repos are the first pilot venture profiles with demoable founder journeys in 2026-Q3.

## Product goals

| Goal | Metric | Target | Evidence |
| ---- | ------ | ------ | -------- |
| G1 | App ship gate | `pnpm build` exit 0 | CI / local witness |
| G2 | Product culture | Fleet culture check PASS | `product-culture-fleet-latest.json` |
| G3 | Pilot journey | One intake → collateral path | `venture-pilot-journey-latest.json` |

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

1. Next.js app — intake, operations, collateral, visibility routes
2. Client profile schema (`schema/client.schema.json`)
3. Product spec + execution roadmap alignment with `machine/spec/product-goals.json`

## Success metrics

- Primary: MVP build green weekly
- Secondary: 1+ pilot journey witness per quarter
- Guardrails: no autonomous external investor sends

## Non-goals

- Replacing `fundraising/` internal GTCX office tooling in v1
- Autonomous legal or financial term commitment without human approval
- Generic global CRM feature parity
