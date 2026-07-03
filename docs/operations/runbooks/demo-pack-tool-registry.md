---
title: 'Venture OS — tool registry demo pack'
status: current
date: 2026-07-03
owner: venture-os
document_type: runbook
tier: operating
tags: ['venture-os', 'demo', 'tool-registry']
review_cycle: on-change
---

# Venture OS — tool registry demo pack

## Demo 1 — Sovereign-safe stack selection

**Hook:** Ministers and regulated buyers see tool choice as governed infrastructure, not taste.

**Persona/JTBD/workflow:** `founder-command`; `jtbd-founder-command-center`; `WF-EXR-004`.

**Narrative:** The operator needs a workflow tool but must defend security, self-host fit, and operational maturity. Venture OS ranks tools against workflow constraints. Resolution: selecting the top-ranked tool creates a receipt.

1. Open `/tools` (`app/app/tools/page.tsx`, `app/app/tools/ToolsWorkspace.tsx`). Say: “The registry is a decision surface, not a catalogue.”
2. Select **Workflow automation** (`app/lib/tool-registry/workflows.ts`). Say: “The constraints change the ranking.” Audience sees ranked tools.
3. Click **Select top ranked** (`app/lib/tool-registry/ranking.ts`, `app/lib/tool-registry/receipts.ts`). Say: “The choice is receipt-backed.” Audience sees a selection receipt.

**WOW moment:** A tool decision produces an auditable rationale instead of a verbal preference.

**Seed data:** Tool dataset `app/lib/tool-registry/dataset/tools.v1.json`; no Postgres seed required.

**Prerequisites:** Offline-contract works locally.

## Demo 2 — Brief publish rail picks constrained tools

**Hook:** Institutional buyers see publish tooling chosen by reliability and governance constraints.

**Persona/JTBD/workflow:** `founder-command`; `jtbd-founder-command-center`; `WF-EXR-002`.

**Narrative:** Publishing a brief needs a different tool profile than ingesting RSS. The operator switches workflow context and Venture OS re-ranks the same registry. Resolution: the ranking is tied to the brief/publish workflow used in `/brief`.

1. Open `/tools` (`app/app/tools/ToolsWorkspace.tsx`). Say: “One registry, multiple governed workflows.”
2. Select **Brief publish** (`app/lib/tool-registry/workflows.ts`). Say: “The system changes the decision frame.” Audience sees rank scores and rationale.
3. Open `/brief` (`app/app/brief/page.tsx`, `app/components/RollingBriefWorkspace.tsx`). Say: “The brief surface exposes the publish rail chosen by the same registry.”

**WOW moment:** Workflow context, not generic popularity, drives the tool decision.

**Seed data:** Tool dataset only.

**Prerequisites:** Offline-contract works locally.

## Demo 3 — Database/vector decision is evidence-gated

**Hook:** Technical buyers see that pgvector is part of the architecture, but the product does not fabricate a vector implementation.

**Persona/JTBD/workflow:** `founder-command`; `jtbd-founder-command-center`; `WF-EXR-004`.

**Narrative:** The platform decision says pgvector lives on Postgres, but this repo has no embedding consumer yet. Venture OS shows PostgreSQL + pgvector as a governed tool option while the deploy runbook enables the extension guardedly. Resolution: the demo lands trust by saying exactly what is built and what is not.

1. Search `pgvector` on `/tools` (`app/lib/tool-registry/dataset/tools.v1.json`). Say: “PostgreSQL + pgvector is registered as the data-platform option.”
2. Open `docs/operations/deploy/data-platform-readiness.md`. Say: “The migration enables `vector` only as an optional extension.”
3. Show `deploy/database/migrations/001_adr002_extensions.sql` and `deploy/database/migrations/002_venture_demo_store.sql`. Say: “No vector column is created because there is no consuming embedding path in this repo.”
4. Run `pnpm db:check`. Say: “The repo’s check enforces that honesty boundary.”

**WOW moment:** The product proves discipline: it prepares the sovereign data platform without inventing retrieval claims.

**Seed data:** `machine/demo/seed-data/venture-demo-seed.json` for data-platform demos; tool registry dataset for the UI step.

**Prerequisites:** Offline-contract for UI and `pnpm db:check`; real migrations require reachable `DATABASE_URL`.
