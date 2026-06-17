---
title: 'BL-MPR-01 — Compliance and repo hygiene closure'
status: intake
date: 2026-06-17
backlog_id: BL-MPR-01
pillar: compliance
priority: P1
promote_to: MPR-01
---

# BL-MPR-01 — Compliance and repo hygiene closure

**Audit refs:** CMP-01..04 · five-pillar compliance 69 · composite withheld

## Issues

| ID | Severity | Issue |
| -- | -------- | ----- |
| CMP-01 | P1 | `app/app/layout.tsx` still uses "Create Next App" metadata |
| CMP-02 | P1 | Missing root `LICENSE` |
| CMP-03 | P1 | P35 strict layout fail |
| CMP-04 | P1 | `pnpm docs:foundation:check` fails — missing `platform/scripts/lib/repo-root.mjs` |
| — | P2 | Missing `pm/retrospectives/`, `pm/ci/README.md`, `audit/FIVE-CORE-AUDITS.md` |

## Acceptance

- `pnpm docs:foundation:check` exit 0
- Page title/description: "GTCX Ventures — Africa Venture OS"
- `LICENSE` present (Apache-2.0 aligned with fleet)
- P35 strict GREEN on next five-pillar run
- Retrospectives scaffold committed

## Verification

```bash
pnpm docs:foundation:check
pnpm ops:check
```
