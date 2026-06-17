---
title: 'S8-02 — Agency handoff'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: S8-02
---

# S8-02 — Agency handoff (approved brief → campaign asset)

## Objective

When a rolling brief item is **approved** in Venture OS, emit a structured handoff ticket to **ecosystem-os/agency** for video finish and campaign asset production.

## API

`POST /api/venture/agency`

## Payload

| Field | Required | Notes |
| ----- | -------- | ----- |
| `briefId` | yes | Venture OS brief identifier |
| `approvalId` | yes | Approval gate reference |
| `approvalStatus` | yes | Must be `approved` |
| `clientId` | yes | Tenant / pilot client |
| `title` | yes | Brief headline |
| `assetTypes` | yes | `video` · `social` · `deck` · `email` |
| `targetRepo` | default | `ecosystem-os/agency` |

## Acceptance

- [x] Zod schema rejects non-approved handoffs
- [x] Automation receipt `agency_handoff` with ticket metadata
- [x] Workflow doc for agency operators
- [x] Vitest coverage

## UAT

```bash
curl -s -X POST http://localhost:3000/api/venture/agency \
  -H 'Content-Type: application/json' \
  -d '{"briefId":"brief-1","approvalId":"appr-1","approvalStatus":"approved","clientId":"gtcx","title":"Launch narrative","assetTypes":["video","social"]}'
```

## Fleet deps

- **ecosystem-os/agency** — consumes handoff ticket; produces finished assets
- **griot-ai** — optional distribution after agency finish (S8-03 newsletter rail)
