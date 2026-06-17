---
title: 'BL-MPR-08 — E2E operator golden path'
status: intake
date: 2026-06-17
backlog_id: BL-MPR-08
pillar: technicalExcellence
priority: P2
promote_to: MPR-08
---

# BL-MPR-08 — E2E operator golden path

**Audit refs:** TE-03 · MPR-03..05 dependencies

## Journey

1. Land on Command Center (TerraOS selected)
2. Filter to Capital opportunities
3. Queue workflow from agent prompt
4. See receipt in agent panel
5. Open Rolling Brief → approval drawer
6. Attempt publish → blocked until approved

## Acceptance

- Playwright spec `e2e/command-center-golden-path.spec.ts`
- Runs in CI on PR to `app/`
- Screenshots attached to `audit/evidence/` on `--write` witness run

## Verification

```bash
pnpm --dir app exec playwright test e2e/command-center-golden-path
```
