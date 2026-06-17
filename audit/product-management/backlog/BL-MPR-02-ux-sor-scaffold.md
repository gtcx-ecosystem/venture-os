---
title: 'BL-MPR-02 — UX SoR scaffold (EXR + pm/ux)'
status: intake
date: 2026-06-17
backlog_id: BL-MPR-02
pillar: world-class
priority: P1
promote_to: MPR-02
---

# BL-MPR-02 — UX SoR scaffold (EXR + pm/ux)

**Audit refs:** CMP-06 · ux-sor-latest.json 0/8 pass · openP1=3

## Issues

| Pack | Item | Detail |
| ---- | ---- | ------ |
| UX-P21-CORE | exr-pack | Missing `docs/architecture/specs/experiences/exr-pack.yaml` |
| UX-P21-CORE | journey-spine | Missing operator journey map |
| UX-P21-CORE | ia-spec | Missing IA navigation spec |
| UX-PM-SCAFFOLD | pm/ux/* | Missing README, personas, jtbd, user-flows |

## Acceptance

- `docs/architecture/specs/experiences/exr-pack.yaml` defines Command Center EXR
- `pm/ux/README.md` + at least one persona, jtbd, user-flow for founder command center
- `pnpm` UX check (when wired) or manual witness refresh shows ux-sor pass

## Operator journey (minimum)

1. Select client (TerraOS)
2. Review P1 opportunities
3. Queue agent workflow
4. Approve brief for external publish
