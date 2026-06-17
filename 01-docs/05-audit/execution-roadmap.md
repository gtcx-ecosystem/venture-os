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

> **Last reconciled:** 2026-06-17 · `execute-roadmap` · Venture OS app bootstrap

## Active phase: **Phase 1 — Internal pilots (GTCX repos as clients)**

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

### Phase 1 — Internal pilots (GTCX repos as clients) (now)

- Make client + opportunity views real with mock data → first live pipelines.

### Phase 2 — Warm client managed service

- ClickUp/Gmail/Calendar operating surfaces + approval workflow.

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
| S1-05 | Expand mock pipeline coverage to 5 pilot clients | pending |

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

