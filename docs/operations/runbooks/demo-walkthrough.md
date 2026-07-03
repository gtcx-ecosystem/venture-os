---
title: 'Venture OS — demo walkthrough'
status: current
date: 2026-06-19
owner: venture-os
document_type: runbook
tier: operating
tags: ['venture-os', 'demo', 'walkthrough']
review_cycle: on-change
---

# Venture OS — demo walkthrough

**Full GA demo index:** `docs/operations/runbooks/demo-index.md`

**Audience:** founders, pilot operators, GTCX internal  
**Entry:** external target `https://venture.gtcx.trade` · staging `https://venture-staging.gtcx.trade` · local `http://localhost:3000`

## Production-style demo (no Next dev overlay)

Use a production build for investor or partner demos — the dev overlay does not appear.

```bash
pnpm install
pnpm build
pnpm start
#open http://localhost:3000
```

**Verification path:** `curl -sf http://localhost:3000/api/health` → HTTP 200

## Path (15 min)

| Step | Route | What to show |
| ---- | ----- | ------------ |
| 1 | `/` | Command center — client context |
| 2 | `/clients` | Portfolio profiles + source counts |
| 3 | `/sources` | Miniflux RSS + Gmail label registry |
| 4 | `/signals` | Inbound feed (rss · gmail · griot filters) |
| 5 | `/opportunities` | Opportunity board + ClickUp dry-run sync |
| 6 | `/brief` | Rolling brief + approval drawer |
| 7 | `/operations` | Setup checklist + inbound queue |

## Demo credentials

Local dev: no auth when `VENTURE_WEBHOOK_SECRET` unset.

## API smoke

```bash
curl -s "http://localhost:3000/api/venture/sources?clientId=terra_os"
curl -s -X POST http://localhost:3000/api/venture/opportunities/sync \
  -H 'Content-Type: application/json' \
  -d '{"clientId":"terra_os","dryRun":true}'
```
