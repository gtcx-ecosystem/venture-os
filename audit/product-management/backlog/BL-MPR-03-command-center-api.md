---
title: 'BL-MPR-03 — Command Center API wiring'
status: intake
date: 2026-06-17
backlog_id: BL-MPR-03
pillar: technicalExcellence
priority: P1
promote_to: MPR-03
---

# BL-MPR-03 — Command Center API wiring

**Audit refs:** TE-01 · TE-05 · architecture gap mock plane

## Problem

`CommandCenterWorkspace.tsx` imports `OPPORTUNITIES` from `mock.ts` directly.  
`/opportunities` page already uses `GET /api/venture/opportunities?clientId=`.

## Acceptance

- Command Center loads opportunities via same API hook as Opportunities workspace
- Hero pipeline metrics derived from loaded data (not hardcoded 42/11/7)
- `mock.ts` becomes seed/fallback only — not imported by production UI paths
- Loading + error states on Command Center grid

## Files

- `app/components/CommandCenterWorkspace.tsx`
- `app/lib/automation/clickup-sync.ts` (eventually real ClickUp source)
- shared hook e.g. `app/lib/hooks/useOpportunities.ts`
