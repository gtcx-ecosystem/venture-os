# Venture OS — demo walkthrough

**Audience:** founders, pilot operators, GTCX internal  
**Entry:** deployed URL or `http://localhost:3000`

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
