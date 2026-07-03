---
title: 'Venture OS — ADR-002 data platform readiness'
status: current
date: 2026-07-03
owner: venture-os
document_type: runbook
tier: critical
tags: ['venture-os', 'deploy', 'postgres', 'demo']
review_cycle: on-change
---

# Venture OS — ADR-002 data platform readiness

**Decision source:** `fabric-os/docs/architecture/decisions/ADR-002-data-platform-postgres-pgvector-timeseries.md`.

## Verified Inventory

| Dimension | Verified repo source | Current behavior | ADR-002 alignment |
| --- | --- | --- | --- |
| Store config | `app/app/api/venture/*/route.ts`, `app/lib/automation/store.ts`, `app/lib/mock.ts` | Static mock arrays and an in-memory automation store when no backend is configured. No ORM or prior migration system existed. | `VENTURE_DATA_BACKEND=postgres` + `DATABASE_URL` opt the API into ADR-002 Postgres. Offline fallback remains for local tests. |
| Opportunity data | `app/lib/mock.ts`, `app/lib/automation/clickup-sync.ts`, `app/app/api/venture/opportunities/route.ts` | Static opportunities are served through the opportunities API. | `venture_opportunities` stores seeded demo rows consumed by the opportunities API when Postgres is enabled. |
| Event/time-series data | `app/lib/automation/inbound.ts`, `app/lib/automation/process-inbound.ts`, `app/lib/automation/receipts.ts`, `app/app/api/venture/inbound/route.ts`, `app/app/api/venture/receipts/route.ts` | Inbound candidates and automation receipts are timestamped in memory. | `venture_inbound_candidates(received_at)` and `venture_automation_receipts(timestamp)` are native range-partitioned with BRIN indexes and default partitions. |
| Vector-shaped data | `app/lib/tool-registry/dataset/tools.v1.json`, `app/lib/tool-registry/workflows.ts` | The tool registry classifies PostgreSQL + pgvector as a tool option. No embedding, similarity, or retrieval consumer path exists in this repo. | `vector` extension enablement is guarded. No vector column is added until a verified consuming code path exists. |

## Migration Surface

| File | Purpose |
| --- | --- |
| `deploy/database/migrations/001_adr002_extensions.sql` | Guarded `CREATE EXTENSION IF NOT EXISTS` for `vector`, `pg_cron`, and `pg_partman`; missing binaries produce loud `NOTICE` output and continue. |
| `deploy/database/migrations/002_venture_demo_store.sql` | Creates `venture_opportunities`, partitioned `venture_inbound_candidates`, partitioned `venture_automation_receipts`, BRIN indexes, and lookup indexes. |
| `deploy/database/seeds/demo.sql` | Idempotent synthetic demo seed. Verifies required columns before insert. |
| `machine/demo/seed-data/venture-demo-seed.json` | Machine-readable seed manifest; rows are explicitly demo-grade synthetic data. |

## Commands

```bash
pnpm db:check
DATABASE_URL="$DEMO_DATABASE_URL" pnpm db:migrate
NODE_ENV=demo DATABASE_URL="$DEMO_DATABASE_URL" pnpm db:seed:demo
```

The seed command refuses `NODE_ENV=production`.

## Demo/Staging/Production Deploy Path

**External hosting target:** `venture.gtcx.trade`.

1. In `fabric-os`, select or copy the target environment under `deploy/terraform/environments/{demo,staging,production}` and apply the ADR-002 RDS PostgreSQL 16 database module.
2. Export the environment database URL as `DATABASE_URL` for this repo’s migration and application runtime.
3. From `venture-os`, run `pnpm db:check`, then `pnpm db:migrate`.
4. For demo or staging only, run `NODE_ENV=demo pnpm db:seed:demo`.
5. Build the app with `pnpm build`.
6. Build/containerize with `docker build -f deploy/docker/Dockerfile -t gtcx-venture-os:<tag> .`.
7. Run the container with `VENTURE_DATA_BACKEND=postgres`, `DATABASE_URL`, `VENTURE_WEBHOOK_SECRET`, and the external host binding for `venture.gtcx.trade`.
8. Verify `GET /api/health`, `GET /api/ready`, `GET /api/venture/opportunities?clientId=terra_os`, and `GET /api/venture/inbound?clientId=terra_os`.

## Honest Credential/Network Line

This repo now contains the migration, seed, runtime switch, container support, and documented hosting target needed for an ADR-002 demo deployment at `venture.gtcx.trade`. Actual environment creation and deploy still require online credentials and network access: DNS/host control for `venture.gtcx.trade`, AWS/fabric-os Terraform credentials for RDS/EKS or Cloud Run credentials for the selected external target, Docker registry access, and a reachable PostgreSQL endpoint.

No real deploy has been claimed by this document.
