---
title: 'Venture OS — demo index'
status: current
date: 2026-07-03
owner: venture-os
document_type: runbook
tier: critical
tags: ['venture-os', 'demo', 'ga']
review_cycle: on-change
---

# Venture OS — demo index

All demos use seeded, synthetic demo-grade data from `deploy/database/seeds/demo.sql` and `machine/demo/seed-data/venture-demo-seed.json` unless marked offline-contract. Do not present seeded rows as production data.

## Demo Matrix

| Application | Demo | Persona | JTBD | Workflow | Wow moment | Env need |
| --- | --- | --- | --- | --- | --- | --- |
| Web command center | DFI pilot withheld until proof | `founder-command` | `jtbd-founder-command-center` / `JTBD-VENTURE-INTAKE-001` | `WF-EXR-001` | Queueing the work creates a claims-review receipt before publish. | Local/offline or Postgres demo |
| Web command center | Capital desk turns signals into an investor brief | `founder-command`; workflow role `capital-analyst` | `JTBD-VENTURE-CAPITAL-001` | `WF-EXR-002` | Evidence chips separate verified opportunities from needs-proof cards. | Local/offline or Postgres demo |
| Web command center | Visibility launch refuses unsupported claims | `founder-command`; workflow role `venture-operator` | `JTBD-VENTURE-COLLATERAL-001` | `WF-EXR-003` | Publish is blocked until Class A approvals clear. | Local/offline |
| Web command center | Signals become an operating queue | `founder-command`; workflow role `venture-operator` | `JTBD-VENTURE-GROWTH-001` | `WF-EXR-004` | Source-scoped inbound feed shows the system already triaged urgency/source. | Postgres demo preferred |
| Automation/API rail | Inbound dedupe prevents duplicate work | `founder-command` | `jtbd-founder-command-center` | `WF-EXR-001` | Replaying the same external ID creates a `dedupe_skip` receipt. | Local/offline or Postgres demo |
| Automation/API rail | Dry-run ClickUp sync with no accidental external write | `founder-command`; workflow role `capital-analyst` | `JTBD-VENTURE-CAPITAL-001` | `WF-EXR-002` | Sync drafts task payloads but withholds live write without credentials. | Local/offline |
| Automation/API rail | Workflow queue routes claims to proof review | `founder-command` | `jtbd-founder-command-center` | `WF-EXR-001` | The response includes a Claims Reviewer card with evidence path. | Local/offline or Postgres demo |
| Automation/API rail | Source registry proves governed ingest | `founder-command`; workflow role `venture-operator` | `JTBD-VENTURE-GROWTH-001` | `WF-EXR-004` | RSS/Gmail/Listmonk bindings are returned per client, not hand-entered during the demo. | Local/offline |
| Tool registry workspace | Sovereign-safe stack selection | `founder-command` | `jtbd-founder-command-center` | `WF-EXR-004` | Selecting the top-ranked tool creates a trust-and-safety receipt. | Local/offline |
| Tool registry workspace | Brief publish rail picks constrained tools | `founder-command` | `jtbd-founder-command-center` | `WF-EXR-002` | Workflow constraints drive the ranking instead of a generic tool list. | Local/offline |
| Tool registry workspace | Database/vector decision is evidence-gated | `founder-command` | `jtbd-founder-command-center` | `WF-EXR-004` | pgvector appears as an option, but no vector column is claimed without a consumer path. | Local/offline + deploy runbook |

## Packs

- `docs/operations/runbooks/demo-pack-command-center.md`
- `docs/operations/runbooks/demo-pack-automation-api.md`
- `docs/operations/runbooks/demo-pack-tool-registry.md`
- Existing short walkthrough: `docs/operations/runbooks/demo-walkthrough.md`

## Skipped Surfaces

This repo ships a Next.js web app and API routes. No mobile app, desktop app, CLI/SDK, bot/channel runtime, or MCP server surface exists under `app/`, `platform/`, or `deploy/`; those surfaces are skipped rather than demoed as vaporware.
