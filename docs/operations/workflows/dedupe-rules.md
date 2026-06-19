---
title: 'Inbound dedupe rules — Venture OS Phase 3'
status: current
date: 2026-06-19
owner: venture-os
document_type: operating-playbook
tier: operating
tags: ['venture-os', 'workflows', 'dedupe']
review_cycle: on-change
---

# Inbound dedupe rules — Venture OS Phase 3

**API:** `POST /api/venture/inbound`  
**Auth:** Optional `Authorization: Bearer $VENTURE_WEBHOOK_SECRET`

## Dedupe key priority

1. **`externalId` present** — `{clientId}:{source}:{externalId}`  
   Use for Gmail message IDs, RSS entry GUIDs, ClickUp task IDs.

2. **Title slug fallback** — `{clientId}:{slug(title)}`  
   Lowercase, non-alphanumeric → hyphen, max 80 chars.

## Duplicate behavior

| Case | HTTP | Store | Receipt |
|------|------|-------|---------|
| New candidate | 201 | Appended with `status: new` | `inbound_capture` |
| Duplicate key | 200 | Appended with `status: duplicate` | `dedupe_skip` |

Only `status: new` entries count toward queue size and Command Center promotion.

## Promotion gate (manual v1)

Inbound candidates **do not** auto-create opportunities or bypass approvals. Operator promotes from `/operations` queue → ClickUp task → approval drawer before publish.

## Example payloads

```json
{
  "source": "gmail",
  "title": "Intro to AfDB DPI window",
  "clientId": "terra_os",
  "kind": "capital",
  "urgency": "P1",
  "externalId": "gmail-msg-abc123"
}
```

```bash
curl -s -X POST http://localhost:3000/api/venture/inbound \
  -H 'Content-Type: application/json' \
  -d '{"source":"n8n","title":"Warm intro","clientId":"terra_os"}'
```

## Digest endpoint

`POST /api/venture/digest` — `{ "clientId": "terra_os", "dryRun": true }`  
Composes brief markdown; **always** sets `approvalRequired: true`. Automation never sends without founder clearance.
