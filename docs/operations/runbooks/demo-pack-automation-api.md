---
title: 'Venture OS — automation API demo pack'
status: current
date: 2026-07-03
owner: venture-os
document_type: runbook
tier: critical
tags: ['venture-os', 'demo', 'api']
review_cycle: on-change
---

# Venture OS — automation API demo pack

## Demo 1 — Inbound dedupe prevents duplicate work

**Hook:** Operators see the moat in a refusal: the second copy of the same external signal is not allowed to create duplicate work.

**Persona/JTBD/workflow:** `founder-command`; `jtbd-founder-command-center`; `WF-EXR-001`.

**Narrative:** A partner forwards the same DFI item twice. Venture OS accepts the first signal and identifies the replay by client/source/external ID. Resolution: a `dedupe_skip` receipt proves the system withheld duplicate work.

1. POST the first signal to `/api/venture/inbound` (`app/app/api/venture/inbound/route.ts`, `app/lib/automation/process-inbound.ts`):
   ```bash
   curl -s -X POST http://localhost:3000/api/venture/inbound \
     -H 'Content-Type: application/json' \
     -d '{"source":"gmail","title":"DFI land-rights pilot window opened","clientId":"terra_os","kind":"capital","urgency":"P1","externalId":"dfi-program-window-2026"}'
   ```
   Say: “First signal enters the operating queue.” Audience sees `duplicate:false`.
2. Repeat the same command. Say: “The second copy is not another task.” Audience sees `duplicate:true`.
3. GET `/api/venture/receipts` (`app/app/api/venture/receipts/route.ts`). Say: “The refusal is auditable.” Audience sees `dedupe_skip`.
4. Open `/operations` (`app/components/InboundQueue.tsx`). Say: “Operators see one actionable candidate, not duplicate noise.”

**WOW moment:** Same external ID triggers a live duplicate skip instead of creating another queue item.

**Seed data:** Optional; demo can generate live local rows. Postgres demo uses `venture_inbound_candidates` and `venture_automation_receipts`.

**Prerequisites:** Local `pnpm build && pnpm start`, or Postgres demo with `VENTURE_DATA_BACKEND=postgres`. Webhook auth requires `Authorization: Bearer $VENTURE_WEBHOOK_SECRET` if configured.

## Demo 2 — Dry-run ClickUp sync with no accidental external write

**Hook:** Buyers see integration readiness without risky external mutation during a boardroom demo.

**Persona/JTBD/workflow:** `founder-command`; workflow role `capital-analyst`; `JTBD-VENTURE-CAPITAL-001`; `WF-EXR-002`.

**Narrative:** A capital desk wants tasks in ClickUp, but credentials should not be sprayed during a demo. The API builds task drafts and says exactly what would happen. Resolution: live sync stays withheld until credentials and dry-run policy are explicit.

1. GET `/api/venture/opportunities?clientId=terra_os` (`app/app/api/venture/opportunities/route.ts`, `app/lib/automation/clickup-sync.ts`). Say: “The sync starts from client-scoped opportunities.” Audience sees TerraOS opportunities.
2. POST `/api/venture/opportunities/sync` (`app/app/api/venture/opportunities/sync/route.ts`, `app/lib/automation/clickup-sync.ts`):
   ```bash
   curl -s -X POST http://localhost:3000/api/venture/opportunities/sync \
     -H 'Content-Type: application/json' \
     -d '{"clientId":"terra_os","dryRun":true}'
   ```
   Say: “Dry-run creates the payload, not an external side effect.” Audience sees task drafts.
3. Explain the live prerequisite from `app/lib/automation/clickup-sync.ts`: `CLICKUP_API_TOKEN` and `CLICKUP_LIST_ID`. Say: “Live mutation is intentionally credential-gated.”

**WOW moment:** The integration is demonstrable and constrained: no silent external write happens in the room.

**Seed data:** `afdb-dpi`, `terra-bank-insurer`.

**Prerequisites:** Offline-contract works locally; live ClickUp sync is not performed.

## Demo 3 — Workflow queue routes claims to proof review

**Hook:** The system accepts a strategic instruction and immediately translates it into governed work.

**Persona/JTBD/workflow:** `founder-command`; `jtbd-founder-command-center`; `WF-EXR-001`.

**Narrative:** The operator asks for a DFI concept note. Venture OS queues the workflow, but the important output is the review structure and receipt. Resolution: claims review is part of the returned work, not a later manual audit.

1. POST `/api/venture/workflow/queue` (`app/app/api/venture/workflow/queue/route.ts`, `app/lib/automation/workflow-queue.ts`):
   ```bash
   curl -s -X POST http://localhost:3000/api/venture/workflow/queue \
     -H 'Content-Type: application/json' \
     -d '{"clientId":"terra_os","prompt":"Create a TerraOS DFI concept note and route claims to proof review."}'
   ```
   Say: “The prompt becomes structured work.” Audience sees review cards.
2. Point to the Claims Reviewer response (`app/lib/automation/workflow-queue.ts`). Say: “Proof is not optional; it is part of the route.”
3. GET `/api/venture/receipts` (`app/app/api/venture/receipts/route.ts`). Say: “The queue action is replayable.” Audience sees `workflow_queued`.

**WOW moment:** The API returns both the work product and the proof boundary in one response.

**Seed data:** `seed-receipt-claims-withheld` if using seeded Postgres; live command also creates a receipt.

**Prerequisites:** Local/offline or Postgres demo.

## Demo 4 — Source registry proves governed ingest

**Hook:** External GA sees that intelligence sources are governed before any signal enters the system.

**Persona/JTBD/workflow:** `founder-command`; workflow role `venture-operator`; `JTBD-VENTURE-GROWTH-001`; `WF-EXR-004`.

**Narrative:** An operator needs to explain where inbound intelligence comes from. The registry returns the source bindings per client. Resolution: ingest is governed by registered RSS/Gmail/Listmonk configuration, not ad hoc scraping.

1. GET `/api/venture/sources?clientId=terra_os` (`app/app/api/venture/sources/route.ts`, `app/lib/automation/source-registry.ts`). Say: “These are the allowed sources for this client.” Audience sees RSS feeds and Gmail labels.
2. Open `/sources` (`app/app/sources/page.tsx`, `app/components/SourceRegistryWorkspace.tsx`). Say: “The same registry powers the UI.”
3. Open `/signals` (`app/app/signals/page.tsx`, `app/components/SignalsWorkspace.tsx`). Say: “Signals are downstream of source authority.”

**WOW moment:** The source registry is machine-readable and UI-visible, giving auditors the same source truth as operators.

**Seed data:** Source registry file `docs/operations/workflows/newsletter-source-registry.json`; Postgres seed optional for queue rows.

**Prerequisites:** Offline-contract works locally; no external Gmail/Miniflux/Listmonk credentials are used.
