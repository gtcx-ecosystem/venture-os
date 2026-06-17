---
title: 'BL-MPR-07 — Fleet ecosystem integration seams'
status: intake
date: 2026-06-17
backlog_id: BL-MPR-07
pillar: productEcosystemIntegration
priority: P2
promote_to: MPR-07
---

# BL-MPR-07 — Fleet ecosystem integration seams

**Audit refs:** PE-01 · PE-02 · DM-01

## Problem

Sidebar lists TerraOS, Markets OS, ComplianceOS, etc. as folder buttons with no cross-repo navigation or canon load.

## Acceptance

- Client switch loads strategy summary from `pm/canon/strategy.json` (via API proxy or fleet manifest)
- Each client row: "Open owner repo" link (GitHub or local path from fleet registry)
- Hero copy uses loaded `vision.statement` / `mission` when available
- Optional: deep link to terminal-os ecosystem surface for published collateral

## Dependencies

- Fleet client registry in `app/lib/clients.ts` extended with `repo`, `canonStrategyPath`
- canon-os `canon:synthesize` run on owner repos
