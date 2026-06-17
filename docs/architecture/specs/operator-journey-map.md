---
title: 'Operator journey map — Venture OS'
status: current
date: 2026-06-17
owner: venture-os
document_type: spec
tier: operating
tags: ['ux', 'journey', 'p21']
---

# Operator journey map — Venture OS

**Persona:** GTCX Ventures founder-operator (pilot: internal studio managing fleet clients)

## J1 — Orient (Command Center)

| Step | Operator action | Surface | System response |
| ---- | --------------- | ------- | ---------------- |
| J1.1 | Open workspace | `/` Command Center | Load opportunities for selected client |
| J1.2 | Select client | Sidebar client folder | Scope metrics + opportunity grid |
| J1.3 | Scan pipeline health | Hero metrics | Qualified / P1 / Needs proof counts from live API |

## J2 — Triage (Opportunities + evidence)

| Step | Operator action | Surface | System response |
| ---- | --------------- | ------- | ---------------- |
| J2.1 | Review P1 cards | Command Center grid | `EvidenceChip` shows verified / needs_proof / blocked |
| J2.2 | Drill into board | `/opportunities` | Full board + ClickUp sync stub |
| J2.3 | Open signals | `/signals` | Inbound feed filters |

## J3 — Agent assist (orchestration)

| Step | Operator action | Surface | System response |
| ---- | --------------- | ------- | ---------------- |
| J3.1 | Queue workflow | Command palette or agent panel | `POST /api/venture/workflow/queue` |
| J3.2 | Confirm receipt | Agent panel | Receipt ID in `GET /api/venture/receipts` log |
| J3.3 | Monitor health | Agent panel badge | Live/Degraded from `/api/health` |

## J4 — Publish (trust gate)

| Step | Operator action | Surface | System response |
| ---- | --------------- | ------- | ---------------- |
| J4.1 | Compose rolling brief | `/brief` | Draft sections + approvals drawer |
| J4.2 | Publish external brief | Rolling Brief Publish | Class A `window.confirm` gate |
| J4.3 | Hand off | `/brief` + fleet rails | Griot/agency/newsletter stubs until wired |

**Golden path (MPR-08):** J1.2 → J2.1 → J3.1 → J4.2
