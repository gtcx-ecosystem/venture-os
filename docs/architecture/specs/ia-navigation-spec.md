---
title: 'IA navigation spec — Venture OS app'
status: current
date: 2026-06-17
owner: venture-os
document_type: spec
tier: operating
tags: ['ux', 'ia', 'p21']
review_cycle: on-change
---

# IA navigation spec — Venture OS app

**Shell:** Sidebar + topbar + main workspace + agent panel (prototype layout)

## Primary nav (sidebar)

| Route | Label | Module | MVP |
| ----- | ----- | ------ | --- |
| `/` | Command Center | Pipeline command | **P0** |
| `/brief` | Rolling Brief | Publish + approvals | **P0** |
| `/intake` | Client Intake | Onboarding form | P1 |
| `/operations` | Operations | Hub status tiles | P1 |
| `/sources` | Sources | Miniflux/Gmail registry | P1 |
| `/signals` | Signals | Inbound feed | P1 |
| `/clients` | Clients | Internal GTCX client directory | P1 |
| `/opportunities` | Opportunities | Board + sync | **P0** |
| `/capital` | Capital Desk | Desk pipeline (stub) | P2 |
| `/growth` | Growth Desk | Desk pipeline (stub) | P2 |
| `/visibility` | Visibility Desk | Desk pipeline (stub) | P2 |
| `/collateral` | Collateral Factory | Desk pipeline (stub) | P2 |

## Global chrome

| Element | Behavior |
| ------- | -------- |
| Client selector | Sidebar folders — scopes API `clientId` |
| Search | Filters visible lists (workspace context) |
| Command palette | `Cmd+K` — nav + queue workflow |
| Agent panel | Receipts + health + queue actions |

## API plane (venture automation)

| Route prefix | Purpose |
| ------------ | ------- |
| `/api/health` | Liveness + agent panel status |
| `/api/venture/opportunities` | Command Center + board data |
| `/api/venture/workflow/queue` | Agent orchestration enqueue |
| `/api/venture/receipts` | Automation receipt log |
| `/api/venture/inbound` | Signal ingestion |
| `/api/venture/griot` · `/agency` · `/newsletter` | Fleet handoff rails |
