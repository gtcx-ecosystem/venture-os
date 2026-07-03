---
title: 'Venture OS — command center demo pack'
status: current
date: 2026-07-03
owner: venture-os
document_type: runbook
tier: critical
tags: ['venture-os', 'demo', 'command-center']
review_cycle: on-change
---

# Venture OS — command center demo pack

## Demo 1 — DFI pilot withheld until proof

**Hook:** Ministers and DFI partners see a sovereign pilot move fast without letting unsupported claims leave the building.

**Persona/JTBD/workflow:** `founder-command` from `machine/ux/personas/persona-founder-command.md`; `jtbd-founder-command-center`; `WF-EXR-001`.

**Narrative:** A TerraOS DFI signal looks urgent, but the system refuses to confuse urgency with permission. The operator queues a capital workflow and the product moment is the proof review card, not a generic dashboard count. Resolution: the concept note can move only after evidence links are attached.

1. Open `/` (`app/app/page.tsx`, `app/components/CommandCenterWorkspace.tsx`). Say: “This is not a report; it is the operating desk for the selected venture.” Audience sees TerraOS context, P1 moves, needs-proof count, and evidence chips.
2. Click **Queue workflow** in the Agent review panel (`app/components/CommandCenterWorkspace.tsx`). Say: “We ask the system to move, but it must keep claims governed.” Audience sees review cards update.
3. Point at the Claims Reviewer card (`app/lib/automation/workflow-queue.ts`). Say: “The system already found the claim boundary and routed it to proof review.” Audience sees `docs/foundation/milestones.md#m4-golden-transaction`.
4. Open `/operations` (`app/app/operations/page.tsx`, `app/components/OperationsHub.tsx`). Say: “The queued work becomes an operating item, with inbound and receipts visible.” Audience sees the inbound queue and receipt log.

**WOW moment:** The intelligence-forward beat is the claims reviewer: the workflow is not merely accepted; it is constrained by an evidence path before external use.

**Seed data:** `afdb-dpi`, `terra-bank-insurer`, `seed-receipt-claims-withheld`. Synthetic demo-grade rows in `deploy/database/seeds/demo.sql`.

**Prerequisites:** Offline-contract works locally. Postgres demo uses `VENTURE_DATA_BACKEND=postgres`, `DATABASE_URL`, `pnpm db:migrate`, and `NODE_ENV=demo pnpm db:seed:demo`.

## Demo 2 — Capital desk turns signals into an investor brief

**Hook:** Institutional buyers see capital motion assembled from evidence-bearing opportunities, not manually curated slides.

**Persona/JTBD/workflow:** `founder-command`; workflow role `capital-analyst`; `JTBD-VENTURE-CAPITAL-001`; `WF-EXR-002`.

**Narrative:** A capital analyst needs to distinguish what is bankable now from what still needs proof. Venture OS shows opportunities, fit, and evidence state in the same motion. Resolution: the brief is generated from the same governed pipeline.

1. Open `/capital` (`app/app/capital/page.tsx`, `app/components/DeskPipelineWorkspace.tsx`). Say: “Capital motion starts from the operating pipeline.” Audience sees capital desk items and horizons.
2. Open `/opportunities?clientId=terra_os` through the UI (`app/app/opportunities/page.tsx`, `app/components/OpportunitiesWorkspace.tsx`). Say: “Cards carry evidence status; the system does not flatten proof and ambition.” Audience sees `needs_proof` chips for TerraOS opportunities.
3. Open `/brief` (`app/app/brief/page.tsx`, `app/components/RollingBriefWorkspace.tsx`). Say: “The brief inherits the same approvals and priorities.” Audience sees rolling brief metrics and priority list.
4. Click **Publish** before approvals clear (`app/components/RollingBriefWorkspace.tsx`, `app/lib/workflow-state.ts`). Say: “Class A external publish is blocked until the approval state is clean.” Audience sees a publish-blocked status and approval drawer.

**WOW moment:** Evidence status and approval state enforce the investor-brief boundary live.

**Seed data:** `afdb-dpi`, `terra-bank-insurer`, and TerraOS approval item `claims` from `app/lib/mock.ts`; Postgres rows are seeded in `deploy/database/seeds/demo.sql`.

**Prerequisites:** Offline-contract works locally. Postgres demo requires seeded `venture_opportunities`.

## Demo 3 — Visibility launch refuses unsupported claims

**Hook:** External GA sees a visibility surface that accelerates messaging while protecting sovereign trust.

**Persona/JTBD/workflow:** `founder-command`; workflow role `venture-operator`; `JTBD-VENTURE-COLLATERAL-001`; `WF-EXR-003`.

**Narrative:** FIFTY-FOUR has a strong launch signal, but public claims need proof before amplification. The operator moves from collateral to visibility to client context without re-entering the story. Resolution: the product keeps the external-facing surface tied to evidence and approval state.

1. Switch client to Terminal OS in the topbar (`app/components/Topbar.tsx`, `app/components/WorkspaceProvider.tsx`). Say: “The same surface scopes to each venture client.” Audience sees Terminal OS context.
2. Open `/collateral` (`app/app/collateral/page.tsx`, `app/components/DeskPipelineWorkspace.tsx`). Say: “Collateral is work in progress, not a slide graveyard.” Audience sees Terminal collateral items.
3. Open `/visibility` (`app/app/visibility/page.tsx`, `app/components/DeskPipelineWorkspace.tsx`). Say: “Visibility inherits the same operating desk.” Audience sees FIFTY-FOUR launch work.
4. Open `/clients` (`app/app/clients/page.tsx`, `app/components/ClientsWorkspace.tsx`). Say: “The client profile shows why this surface exists and where the sources bind.” Audience sees profile and source context.

**WOW moment:** Public visibility is framed by client-scoped evidence and work state, not an isolated marketing dashboard.

**Seed data:** `fifty-four-press`, `terminal-vis-1`, `terminal-col-1`; static fallback in `app/lib/mock.ts`, Postgres opportunity seed in `deploy/database/seeds/demo.sql`.

**Prerequisites:** Offline-contract works locally; no external publish is performed.

## Demo 4 — Signals become an operating queue

**Hook:** Operators see external signals arrive already scoped, ranked, and receipt-backed.

**Persona/JTBD/workflow:** `founder-command`; workflow role `venture-operator`; `JTBD-VENTURE-GROWTH-001`; `WF-EXR-004`.

**Narrative:** Inbound sources are noisy. Venture OS binds RSS, Gmail, and Griot sources to a client, then the feed shows what needs action. Resolution: signals become an auditable queue instead of a manual inbox sweep.

1. Open `/sources` (`app/app/sources/page.tsx`, `app/components/SourceRegistryWorkspace.tsx`). Say: “Source authority is registered per client before ingestion.” Audience sees Miniflux feeds, Gmail labels, and Listmonk binding.
2. Open `/signals` (`app/app/signals/page.tsx`, `app/components/SignalsWorkspace.tsx`). Say: “The feed is filtered by source and client.” Audience sees inbound candidates from the queue.
3. Use the `griot` or `gmail` filter (`app/components/SignalsWorkspace.tsx`). Say: “The system already tagged the source and urgency.” Audience sees scoped candidates.
4. Open `/operations` (`app/components/InboundQueue.tsx`). Say: “Receipts prove what entered the queue.” Audience sees automation receipts.

**WOW moment:** With Postgres seeded, the same rows show up as source-filtered signals and receipt-backed operations without re-keying.

**Seed data:** `seed-inbound-terra-dfi`, `seed-inbound-terminal-griot`, `seed-receipt-terra-dfi`, `seed-receipt-terminal-griot`.

**Prerequisites:** Best as Postgres demo with `VENTURE_DATA_BACKEND=postgres`; offline-contract can show empty queue plus source registry.
