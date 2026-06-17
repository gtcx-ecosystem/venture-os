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

> **Last reconciled:** 2026-06-17 · `execute-roadmap` · PROV-01 P35 lift

**Stories:** [`pm/stories/`](./stories/) · **Intake backlog:** [`audit/product-management/backlog/`](../audit/product-management/backlog/)

## Active phase: **Phase 5 — 11PR UI hardening** (Sprint 11 in flight)

**Audit:** [`audit/product-management/venture-os-mpr-ui-audit-2026-06-17.md`](../audit/product-management/venture-os-mpr-ui-audit-2026-06-17.md) · witness [`audit/evidence/venture-os-mpr-ui-audit-2026-06-17.json`](../audit/evidence/venture-os-mpr-ui-audit-2026-06-17.json)

## Sprints

### Sprint 11 — 11PR UI hardening (Command Center)

| Story | Title | Status | Pillar |
|------:|-------|--------|--------|
| MPR-05 | Trust envelope on cards + publish gates | done | Trust & Safety |
| MPR-03 | Command Center API wiring | done | Technical Excellence |
| MPR-04 | Agent orchestration + receipt envelope | done | Agentic Empowerment |
| MPR-01 | Compliance + repo hygiene closure | done | Compliance |
| MPR-02 | UX SoR scaffold (EXR + pm/ux) | done | World-class |
| MPR-06 | World-class polish (states, metrics, a11y) | done | World-class |
| MPR-07 | Fleet ecosystem integration seams | todo | Ecosystem Integration |
| MPR-08 | E2E operator golden path | todo | Technical Excellence |

### Sprint 10 — Control plane modules (Phase 4) — **sealed**

| Story | Title | Status |
|------:|-------|--------|
| P4-01 | Sources control plane (`/sources`) | done |
| P4-02 | Signals feed (`/signals`) | done |
| P4-03 | Clients directory (`/clients`) | done |
| P4-04 | Opportunities board (ClickUp sync stub) | done |

### Sprint DEPLOY — Pilot publish wiring

| Story | Title | Status |
|------:|-------|--------|
| DEPLOY-01 | AWS/GCP deploy wiring (Dockerfile, EKS manifest, Cloud Run script) | done |
| DEPLOY-02 | Staging deploy (fabric-os EKS overlay) | done |

### Sprint 9 — Newsletter source registry — **sealed**

| Story | Title | Status |
|------:|-------|--------|
| S9-01 | Newsletter source registry (Miniflux/Gmail → inbound) | done |

### Sprint PROV — Fleet provisioning (P35)

| Story | Title | Status |
|------:|-------|--------|
| PROV-01 | P35 hubs + `pm/` scaffold + harness scripts + migrate `01-docs/` | done |
| PROV-02 | Fleet registry entry (bridge-os zenhub) | done |

### Sprint 8 — Media syndication (griot + agency) — **sealed**

| Story | Title | Status |
|------:|-------|--------|
| S8-01 | Griot webhook adapter (`POST /api/venture/griot`) | done |
| S8-02 | Agency handoff spec (approved brief → campaign asset) | done |
| S8-03 | Newsletter send rail stub (Listmonk dry-run) | done |

*(Sprints 0–7 complete — see git history `01-docs` → `pm/execution-roadmap` migration.)*

## P35 canonical paths

| Artifact | Path |
| -------- | ---- |
| Execution roadmap | `pm/execution-roadmap.md` |
| Story specs | `pm/stories/S*-*.md` |
| Intake backlog | `audit/product-management/backlog/BL-*-*.md` |
| Ops workflows | `docs/operations/workflows/` |
| Ops templates | `docs/operations/templates/` |
| Product canon | `docs/product/` |

## Story details

### PROV-01 — Fleet provisioning lift

- **Acceptance:** `pnpm ops:check` exit 0; no `01-docs/` at root; `pm/manifest.json` present
- **UAT:** `pnpm agent:next-work --json` resolves venture-os roadmap
