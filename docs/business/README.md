---
title: 'business/ — market, customers, economics'
status: current
date: 2026-06-16
owner: venture-os
document_type: folder-spec
tier: critical
tags: ['documentation', 'business']
review_cycle: on-change
goals: 'Business narrative SoR — venture studio fundraising and growth OS'
---

# `docs/business/` — venture-os

> **Cross-reference spec:** [`../../canon-os/pm/spec/docs-layer-cross-reference.json`](../../canon-os/pm/spec/docs-layer-cross-reference.json)  
> **Foundation (read first):** [`../foundation/`](../foundation/) — vision/mission summaries only; detail lives here.

Venture OS productizes the GTCX fundraising and growth operating system for Africa-focused founders, venture studios, accelerators, and ecosystem builders.

## Layer map

| Layer        | Path               | Role                                                           |
| ------------ | ------------------ | -------------------------------------------------------------- |
| Foundation   | `docs/foundation/` | Agent mandatory — charter, vision, mission, goals              |
| **Business** | `docs/business/`   | Market, customers, economics, strategy depth                   |
| Product UX   | `docs/product/ux/` | Personas, JTBD, workflows                                      |
| Reference    | `docs/reference/`  | Templates + glossary only (post-decomposition)                 |

## Cross-reference table

| Topic         | Foundation                             | Business canonical                                               | Product narrative                          |
| ------------- | -------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| Vision detail | [vision.md](../foundation/vision.md)   | [strategy/executive-summary.md](./strategy/executive-summary.md) | [product-spec](../product/ux/narratives/product-spec.md) |
| Customers     | [mission.md](../foundation/mission.md) | [customers/](./customers/)                                       | [pilot-onboarding](../product/ux/narratives/pilot-onboarding.md) |
| Markets       | —                                      | [market/](./market/)                                             | [gtm-and-packaging](../product/ux/narratives/gtm-and-packaging.md) |
| Economics     | [goals.md](../foundation/goals.md)     | [economics/](./economics/)                                       | —                                          |
| Research      | —                                      | [research/](./research/)                                         | —                                          |

## Subfolders

| Folder          | Contents                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| `market/`       | primary/secondary/tertiary market, problem, stakeholder analysis                    |
| `customers/`    | ICP, personas, core audiences                                                       |
| `economics/`    | business model, pricing, revenue, metrics                                           |
| `strategy/`     | executive summary, ecosystem integration                                            |
| `research/`     | industry transformation, funding, capital markets, ecosystem overview, master voice |
| `case-studies/` | sector case studies                                                                 |
| `use-cases/`    | stakeholder use cases                                                               |

## Internal vs product

[`../../fundraising/`](../../fundraising/) remains the internal GTCX fundraising office; Venture OS is the external product layer.

## Agent rules

1. Read `docs/foundation/` before P22; use `docs/business/` for market/customer depth.
2. Do not recreate business narrative under `docs/reference/product/` — pointers only.
3. Log structural changes in `docs/CHANGELOG.md`.
