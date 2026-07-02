---
title: 'P4-04 — Opportunities board'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: P4-04
---

# P4-04 — Opportunities board (ClickUp sync stub)

## Objective

Product board at `/opportunities` with ClickUp task draft sync (dry-run default).

## APIs

- `GET /api/venture/opportunities?clientId=`
- `POST /api/venture/opportunities/sync`

## Acceptance

- [x] Board grouped by opportunity kind
- [x] ClickUp task mapping per board template custom fields
- [x] Dry-run receipt `clickup_sync_dry_run`
- [x] Vitest coverage

## UAT

Open `/opportunities` → **ClickUp sync (dry-run)** → inspect JSON tasks in network tab.
