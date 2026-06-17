---
title: 'Venture OS Command Center — 11PR UI audit'
status: current
date: 2026-06-17
owner: venture-os
document_type: audit-report
audit_id: MPR-UI-2026-06-17
---

# Venture OS Command Center — 11PR in-depth audit

**Surface:** `http://localhost:3000/` Command Center + app shell  
**Witness:** [`audit/evidence/venture-os-mpr-ui-audit-2026-06-17.json`](../evidence/venture-os-mpr-ui-audit-2026-06-17.json)  
**Fleet baseline:** [`audit/evidence/five-pillar-latest.json`](../evidence/five-pillar-latest.json) (composite 59, compliance 69)

## Verification (2026-06-17)

| Command | Exit | Result |
| ------- | ---- | ------ |
| `pnpm test` | 0 | 13 files · 31 tests |
| `pnpm lint` | 0 | clean |
| `pnpm build` | 0 | all routes compile |
| `pnpm ops:check` | 0 | ok |
| `pnpm docs:foundation:check` | 1 | missing `platform/scripts/lib/repo-root.mjs` |

## Composite scores (feature scope)

| Tier | Score | Publishable |
| ---- | ----- | ----------- |
| Foundation | **62 / 100** | No |
| Transformational | **71 / 100** | Provisional |
| **Composite** | **66 / 100** | **Withheld** |

Strongest pillar: **Commercial Value (82)**. Weakest: **Trust & Safety (55)**.

## Architecture gap (root cause)

The app has **two data planes**:

1. **Wired plane** — `/opportunities`, `/sources`, `/signals`, `/inbound` call `/api/venture/*`
2. **Mock plane** — Command Center, Rolling Brief, desk pipelines import `app/lib/mock.ts` directly

Command Center is the **hero surface** but sits on the mock plane. APIs exist (`/api/venture/agency`, `/api/venture/griot`) but the operator journey does not call them.

## Findings by pillar (summary)

### Foundation

| Pillar | Score | Top issues |
| ------ | ----- | ---------- |
| Compliance | 58 | Boilerplate metadata, LICENSE, P35 strict, broken foundation check, UX SoR 0/8 |
| Technical Excellence | 68 | CC mock bypass, local-only agent queue, no E2E golden path |
| Craft | 74 | Generic AI aesthetic, decorative Live badge |
| World-class | 72 | No empty/loading/error states, ESL-2 |
| Trust & Safety | 55 | No evidence on claims, receipts not surfaced, mock publish paths |

### Transformational (blocked until foundation ≥85)

| Pillar | Score | Note |
| ------ | ----- | ---- |
| Creativity | 78 | Desk taxonomy differentiated |
| Commercial Value | 82 | GTM-native cards — best pillar |
| Defensive Moat | 70 | Fleet client context latent |
| Agentic Empowerment | 65 | Agent rail cosmetic |
| Ecosystem Integration | 68 | Named fleet, not wired |
| IP Magic | 73 | Wow potential undercut by stubs |

## Backlog

Promoted to **Sprint 11 — 11PR UI hardening** in [`pm/execution-roadmap.md`](../../pm/execution-roadmap.md).

| Story | Title | Pillars |
| ----- | ----- | ------- |
| MPR-01 | Compliance + repo hygiene closure | P1 Compliance |
| MPR-02 | UX SoR scaffold (EXR + pm/ux) | P1 Compliance, P4 World-class |
| MPR-03 | Command Center API wiring | P2 TE, P10 Integration |
| MPR-04 | Agent orchestration + receipts | P9 Agentic, P5 Trust |
| MPR-05 | Trust envelope on cards + publish gates | P5 Trust |
| MPR-06 | World-class polish (states, metrics, a11y) | P3 Craft, P4 World-class |
| MPR-07 | Fleet ecosystem seams | P8 Moat, P10 Integration |
| MPR-08 | E2E operator golden path | P2 TE, P5 Trust |

Intake detail: [`audit/product-management/backlog/`](./backlog/)
