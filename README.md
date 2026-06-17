---
title: 'Venture OS'
status: current
date: 2026-06-17
owner: ecosystem-os
document_type: operating-system
tier: strategic
tags: ['venture-os', 'africa', 'fundraising', 'growth', 'founders', 'gtm']
review_cycle: weekly
---

# Venture OS

Venture OS is the productized version of the GTCX fundraising engine: an
Africa-focused operating system for founders, venture studios, accelerators,
funds, and ecosystem builders to raise capital, grow revenue, build visibility,
manage investor relationships, produce collateral, win partnerships, and scale.

The GTCX ecosystem repos are the first pilot clients. Each repo represents a
venture profile Venture OS must support: infrastructure, commodity markets,
land, compliance, exploration, intelligence media, producer channels, truth
verification, digitization, design systems, deployment, and agent runtime.

## Product Position

**Capital Desk + Growth Desk + Visibility Desk for African and Global South
ventures.**

Venture OS is not a generic CRM. It is a founder-driven execution engine that
turns messy opportunity flow into funded, visible, investable, partnership-ready
companies.

## Dev app

The Next.js app lives in [`app/`](./app/). From repo root:

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint     # eslint
pnpm build    # production build (all routes)
```

**Deploy:** AWS ECR→EKS (fabric-os) or GCP Cloud Run — see [`docs/operations/deploy/deployment-profile.md`](./docs/operations/deploy/deployment-profile.md).

**Quality gates:** `pnpm lint` and `pnpm build` must pass before merging app changes.

## Files

| File | Purpose |
| ---- | ------- |
| [`docs/product/product-spec.md`](./docs/product/product-spec.md) | Product scope, modules, MVP |
| [`docs/product/implementation-roadmap.md`](./docs/product/implementation-roadmap.md) | Phase 0–6 build path |
| [`pm/execution-roadmap.md`](./pm/execution-roadmap.md) | Living execute-roadmap (sprints) |
| [`schema/client.schema.json`](./schema/client.schema.json) | Machine-readable client profile contract |

## Relationship To Fundraising

[`../fundraising/`](../fundraising/) remains the internal fundraising office for
GTCX. Venture OS is the product layer that generalizes that operating system for
external clients.

| Layer | Internal GTCX | Productized Venture OS |
| ----- | ------------- | ---------------------- |
| Fundraising | GTCX pipeline, sources, investors, applications | Multi-client capital pipeline |
| Growth | Product portfolio revenue and pilots | Founder growth engine |
| Visibility | GTCX thought leadership and media | Press, content, events, visibility desk |
| Partnerships | GTCX sovereign, DFI, buyer, ecosystem deals | Partner development pipeline |
| Operations | ClickUp/Gmail/Calendar/n8n | Client workspace + managed service + future app |

## Operating Principle

Venture OS should behave like a serious venture studio growth office, not a
chatbot. Agents prepare, monitor, draft, analyze, score, and coordinate.
Humans approve external sends, submissions, public claims, financial terms,
legal terms, and strategic relationship moves.
