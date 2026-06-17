# Deployment profile — venture-os

**App:** Next.js 16 in [`app/`](../../app/)  
**Primary host:** Vercel (recommended)  
**Status:** CI green · Vercel project wiring required for live URL

## Build

```bash
pnpm install
pnpm build   # from repo root — delegates to app/
pnpm ops:check
```

## Vercel

1. Import `gtcx-ecosystem/venture-os` in Vercel.
2. Set **Root Directory** to `app` (or use [`app/vercel.json`](../../app/vercel.json)).
3. Install/build commands are defined in `vercel.json`.

## Environment variables (staging)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `VENTURE_WEBHOOK_SECRET` | recommended | API route auth |
| `CLICKUP_API_TOKEN` | optional | Live ClickUp sync |
| `CLICKUP_LIST_ID` | optional | Venture Opportunities list |
| `LISTMONK_URL` | optional | Newsletter live send |

## Smoke after deploy

```bash
curl -sSf "$DEPLOY_URL/api/venture/opportunities?clientId=terra_os"
curl -sSf "$DEPLOY_URL/sources" -o /dev/null -w '%{http_code}\n'
```

## Witness

Record URL in [`audit/evidence/deployment-proof-latest.json`](../../audit/evidence/deployment-proof-latest.json) after first green deploy.
