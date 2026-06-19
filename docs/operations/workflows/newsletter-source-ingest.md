---
title: 'Newsletter source ingest (Miniflux + Gmail)'
status: current
date: 2026-06-15
owner: venture-os
tier: operating
tags: ['runbook', 'documentation']
review_cycle: on-change
document_type: runbook
goals: 'Hub documentation — runbook'
---
# Newsletter source ingest (Miniflux + Gmail)

Maps external signals into Venture OS inbound queue via [`newsletter-source-registry.json`](./newsletter-source-registry.json).

## Endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/api/venture/sources` | List registry (all clients or `?clientId=`) |
| POST | `/api/venture/sources/miniflux` | Miniflux entry webhook → `source: rss` |
| POST | `/api/venture/sources/gmail` | Gmail label webhook → `source: gmail` |

## Miniflux (RSS)

Point Miniflux webhook URL at Venture OS:

```bash
curl -s -X POST http://localhost:3000/api/venture/sources/miniflux \
  -H 'Content-Type: application/json' \
  -d '{
    "feed": { "id": 101 },
    "entry": {
      "id": 9001,
      "title": "AfDB approves regional trade facility",
      "url": "https://example.com/story"
    }
  }'
```

Feed `id` must exist in registry for a client with `rss` enabled.

## Gmail (labels)

n8n `gmail-inbound-to-clickup` posts labeled messages:

```bash
curl -s -X POST http://localhost:3000/api/venture/sources/gmail \
  -H 'Content-Type: application/json' \
  -d '{
    "label": "VO/terra_os/inbox-opportunities",
    "messageId": "msg-abc",
    "subject": "Pilot intro from DFI partner",
    "snippet": "Following up on sovereign data room"
  }'
```

Labels follow [`gmail-calendar-setup.md`](./gmail-calendar-setup.md) `VO/{client}/` convention.

## Operator checklist

1. Register feeds and labels in `newsletter-source-registry.json`.
2. Verify `GET /api/venture/sources?clientId=terra_os`.
3. Fire test webhooks; confirm candidates on `/operations` inbound queue.
4. Route approved items to newsletter rail (`POST /api/venture/newsletter`).

## Related

- Story: [`pm/stories/S9-01-newsletter-source-registry.md`](../../../pm/stories/S9-01-newsletter-source-registry.md)
- Backlog: [`audit/product-management/backlog/BL-NEWS-01-newsletter-source-registry.md`](../../../audit/product-management/backlog/BL-NEWS-01-newsletter-source-registry.md)
