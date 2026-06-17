---
title: 'EXR-001 — Founder command center triage'
status: current
date: 2026-06-17
owner: 'GTCX Ventures'
tier: operating
tags: ['protocol', 'documentation']
review_cycle: on-change
document_type: protocol
document_id: EXR-001
journey_phase: J1-J3
product_module: Command Center
workflow: W1-triage
pilot_critical: true
---

# EXR-001 — Founder command center triage

| Field | Value |
| ----- | ----- |
| **Persona** | founder-command (GTCX Ventures operator) |
| **JTBD** | [jtbd-founder-command-center](../../../../pm/ux/jtbd/jtbd-founder-command-center.json) |
| **Flow** | [flow-founder-command-center](../../../../pm/ux/user-flows/flow-founder-command-center.md) |
| **Status** | **partial** — live API metrics, evidence chips, workflow receipts; desk stubs remain |

## Job story

When **I start my day managing portfolio ventures**, I want **a single command surface scoped to one client**, so I can **see P1 opportunities, evidence gaps, and queue agent work without switching tools**.

## Success metrics

| Metric | Target | Status |
| ------ | ------ | ------ |
| Hero metrics from API | Not hardcoded | **done** — MPR-03 |
| Evidence on every card | `evidenceStatus` chip | **done** — MPR-05 |
| Queue workflow receipt | Visible in agent panel | **done** — MPR-04 |
| Loading / error / empty | Grid states | **done** — MPR-03 |

## Engineering map

- `app/components/CommandCenterWorkspace.tsx`
- `app/lib/hooks/useOpportunities.ts`
- `app/lib/opportunities.ts` — `computePipelineMetrics`, evidence helpers
- `app/app/api/venture/opportunities/route.ts`
- `app/app/api/venture/workflow/queue/route.ts`
- `app/app/api/venture/receipts/route.ts`

## Does NOT Cover

External publish to Listmonk/ClickUp live credentials, cross-repo Griot handoff implementation, or production secrets — see fleet runbooks and `DEPLOY-02` witness.
