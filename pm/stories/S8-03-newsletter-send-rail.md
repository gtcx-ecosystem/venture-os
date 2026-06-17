---
title: 'S8-03 — Newsletter send rail'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: S8-03
---

# S8-03 — Newsletter send rail stub (Listmonk dry-run)

## Objective

Compose Listmonk campaign payloads for approved newsletter content. Default **dry-run** — no external send without approval + credentials.

## API

`POST /api/venture/newsletter`

## Payload

| Field | Required | Notes |
| ----- | -------- | ----- |
| `clientId` | yes | Must exist in client registry |
| `approvalId` | yes | Venture OS approval reference |
| `approvalStatus` | yes | Must be `approved` |
| `subject` | yes | Campaign subject (client prefix applied) |
| `bodyHtml` | yes | HTML body |
| `listmonkListId` | optional | Override registry mapping |
| `dryRun` | default `true` | When false, exposes Listmonk endpoint hint |

## Source registry

[`docs/operations/workflows/newsletter-source-registry.json`](../../docs/operations/workflows/newsletter-source-registry.json) — maps `clientId` → Listmonk list + ingest sources (BL-NEWS-01).

## Acceptance

- [x] Zod schema + Listmonk campaign draft builder
- [x] Dry-run receipt `newsletter_dry_run`
- [x] Client list mapping from registry JSON
- [x] Vitest coverage

## UAT

```bash
curl -s -X POST http://localhost:3000/api/venture/newsletter \
  -H 'Content-Type: application/json' \
  -d '{"clientId":"terra_os","approvalId":"appr-1","approvalStatus":"approved","subject":"June pulse","bodyHtml":"<p>Highlights</p>","dryRun":true}'
```

## Fleet deps

- **Listmonk** — `LISTMONK_URL`, `LISTMONK_API_USER`, `LISTMONK_API_TOKEN` for live send (future)
- **BL-NEWS-01** — Miniflux/Gmail source rails (Sprint 9)
