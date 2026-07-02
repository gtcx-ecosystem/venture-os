---
title: 'S8-01 — Griot webhook adapter'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: S8-01
---

# S8-01 — Griot webhook adapter

## Objective

Accept griot-ai webhook events (`signal.created`, `content.published`, `score.updated`) and normalize into Venture OS inbound queue with dedupe.

## API

`POST /api/venture/griot`

## Acceptance

- [x] Zod schema for Griot event envelope
- [x] Maps to `InboundPayload` with `externalId` for dedupe
- [x] Reuses `processInboundRequest` + automation receipts
- [x] Vitest coverage

## UAT

```bash
curl -s -X POST http://localhost:3000/api/venture/griot \
  -H 'Content-Type: application/json' \
  -d '{"event":"signal.created","data":{"signalId":"sig-demo","headline":"AfDB trade window","iso":"GHA"}}'
```

Verify candidate on `/operations` inbound queue.

## Fleet deps

- griot-ai `POST /api/v1/webhooks` → point URL at Venture OS
- terminal_os default `clientId` when omitted
