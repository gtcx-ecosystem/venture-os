---
title: 'S9-01 — Newsletter source registry'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: S9-01
backlog_id: BL-NEWS-01
---

# S9-01 — Newsletter source registry (BL-NEWS-01)

## Objective

Register Miniflux RSS feeds and Gmail labels per client; ingest via webhooks into inbound queue (`source: rss | gmail`).

## APIs

- `GET /api/venture/sources`
- `POST /api/venture/sources/miniflux`
- `POST /api/venture/sources/gmail`

## Acceptance

- [x] Registry JSON with feed IDs + Gmail labels per client
- [x] Resolve client by feed id or label
- [x] Map to `InboundPayload` with dedupe `externalId`
- [x] Vitest coverage

## UAT

```bash
curl -s 'http://localhost:3000/api/venture/sources?clientId=terra_os'
curl -s -X POST http://localhost:3000/api/venture/sources/miniflux \
  -H 'Content-Type: application/json' \
  -d '{"feed":{"id":101},"entry":{"id":1,"title":"Test RSS item"}}'
```

## Fleet deps

- Miniflux instance with feed IDs matching registry
- n8n Gmail label trigger per [`gmail-calendar-setup.md`](../../docs/operations/workflows/gmail-calendar-setup.md)
