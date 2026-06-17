---
title: 'Execution roadmap — Venture OS'
status: current
date: 2026-06-17
owner: venture-os
document_type: execution-roadmap
tier: critical
tags: ['execute-roadmap', 'roadmap', 'delivery']
---

# Execution roadmap — Venture OS

> **Last reconciled:** 2026-06-17 · `execute-roadmap` · P35 `01-docs` IA + Sprint 8

**PM SoR pointer:** [`pm/execution-roadmap.md`](../../pm/execution-roadmap.md)  
**Numbered specs:** [`stories/`](./stories/) · **Intake backlog:** [`backlog/`](./backlog/)

## Active phase: **Phase 3 — Automation Layer**

**Phase 2** (managed service surfaces) is **complete** — operational onboarding of warm clients remains.

**Sources reviewed:**

- `README.md`
- `implementation-roadmap.md`
- `clients/internal-gtcx-clients.json`
- `prototype/index.html`, `prototype/styles.css`, `prototype/app.js`
- `app/app/page.tsx`, `app/app/globals.css`

## Phases

### Phase 0 — App bootstrap + prototype port (complete)

- Port the static prototype into a real Next.js app surface without losing visual fidelity.
- Establish navigation + component boundaries so subsequent design iterations are fast.

### Phase 1 — Internal pilots (GTCX repos as clients) (complete)

- Make client + opportunity views real with mock data → first live pipelines.

### Phase 2 — Warm client managed service (complete)

- ClickUp/Gmail/Calendar operating surfaces + approval workflow.

### Phase 3 — Automation Layer (now)

- n8n inbound capture, dedupe, digest stubs; approval gates preserved.

## Sprints (1 week)

### Sprint 0 — P0 unblock + shell (complete)

| Story | Title | Status |
|------:|-------|--------|
| S0-01 | App shell exists; prototype CSS loads; Command Center renders | done |
| S0-02 | Add route skeletons (`/capital`, `/growth`, `/visibility`, `/collateral`) | done |
| S0-03 | Componentize layout (Sidebar/Topbar) + view switch wiring | done |
| S0-04 | Port interactive behaviors from `prototype/app.js` (search + filter + run agent queue) | done |
| S0-05 | Add dev-quality gates (`pnpm lint`, `pnpm build`) documented in repo root | done |

### Sprint 1 — GTCX client profiles + desk pipelines

| Story | Title | Status |
|------:|-------|--------|
| S1-01 | Load GTCX client profiles from `clients/internal-gtcx-clients.json` | done |
| S1-02 | Wire sidebar client selection into workspace context | done |
| S1-03 | Render desk pipelines scoped to selected client | done |
| S1-04 | Filter Command Center opportunities by selected client | done |
| S1-05 | Expand mock pipeline coverage to 5 pilot clients | done |

### Sprint 2 — Tool registry + rolling brief

| Story | Title | Status |
|------:|-------|--------|
| S2-01 | Tool Registry schema + dataset + Zod validation | done |
| S2-02 | Explainable ranking for workflows | done |
| S2-03 | `/tools` inspection UI (FOSS-first metadata) | done |
| S2-04 | Rolling Brief route (`/brief`) with priority list + pipeline + calendar | done |
| S2-05 | Approvals drawer sidepanel on brief | done |
| S2-06 | Selection receipts + command palette (power-user) | done |

### Sprint 3 — AI-native orchestration wiring

| Story | Title | Status |
|------:|-------|--------|
| S3-01 | Wire tool ranking into rolling brief (signal + publish hops) | done |
| S3-02 | Brief export + publish actions (mock) | done |
| S3-03 | Workflow map: signals → enrich → approve → publish | done |

### Sprint 4 — Phase 2 kickoff (managed service)

| Story | Title | Status |
|------:|-------|--------|
| S4-01 | Day 0 client intake form (`/intake`) pre-filled from client profile | done |
| S4-02 | ClickUp board template + Gmail/Calendar setup guide (docs) | done |
| S4-03 | Approval workflow wiring (intake → brief → publish) | done |

### Sprint 5 — Operating system hub

| Story | Title | Status |
|------:|-------|--------|
| S5-01 | Operations hub route (`/operations`) with Day 4 setup checklist | done |
| S5-02 | n8n workflow manifest (JSON) for inbound + digest | done |

### Sprint 6 — Phase 2 deliverables (templates)

| Story | Title | Status |
|------:|-------|--------|
| S6-01 | Monthly investor update template + export from brief | done |
| S6-02 | Pricing/options memo (managed service) | done |

### Sprint 7 — Phase 3 automation stubs

| Story | Title | Status |
|------:|-------|--------|
| S7-01 | Inbound webhook API (`POST /api/venture/inbound`) + dedupe rules | done |
| S7-02 | Automation receipts + inbound queue on `/operations` | done |
| S7-03 | Daily digest API stub (`POST /api/venture/digest`) with approval gate | done |

### Sprint 8 — Media syndication (griot + agency)

| Story | Title | Status |
|------:|-------|--------|
| S8-01 | Griot webhook adapter (`POST /api/venture/griot`) | done |
| S8-02 | Agency handoff spec (approved brief → campaign asset) | pending |
| S8-03 | Newsletter send rail stub (Listmonk dry-run) | pending |

## P35 doc layout (`01-docs/`)

| Layer | Path | Contents |
| ----- | ---- | -------- |
| 04-ops | `01-docs/04-ops/workflows/`, `templates/` | Operating rails |
| 05-audit | `01-docs/05-audit/execution-roadmap.md` | This file |
| 05-audit | `01-docs/05-audit/stories/S*-*.md` | Numbered story specs |
| 05-audit | `01-docs/05-audit/backlog/BL-*-*.md` | Intake backlog |

## Story details

### S0-02 — Route skeletons

- **Files:** `app/app/(desk)/*`
- **Acceptance:** `pnpm --dir app build`
- **UAT:** Load each route in dev server; verify sidebar + topbar consistent.

### S0-03 — Componentize layout

- **Files:** `app/components/*`, `app/app/layout.tsx`, `app/app/(desk)/layout.tsx`
- **Acceptance:** `pnpm --dir app lint && pnpm --dir app build`
- **UAT:** Toggle active nav states and preserve scroll.

### S0-04 — Port interactive behaviors

- **Files:** `app/components/CommandCenterClient.tsx` (client component)
- **Acceptance:** `pnpm --dir app lint && pnpm --dir app build`
- **UAT:** Search filters cards; run-agent button prepends review card.

### S0-05 — Dev-quality gates documented

- **Files:** `README.md`
- **Acceptance:** `pnpm --dir app lint && pnpm --dir app build`

