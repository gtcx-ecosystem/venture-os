---
title: 'P4-01 — Sources control plane'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: P4-01
---

# P4-01 — Sources control plane

## Objective

Surface `newsletter-source-registry.json` in the app at `/sources` for the selected client.

## Acceptance

- [x] `/sources` route with RSS + Gmail bindings
- [x] Reads `GET /api/venture/sources?clientId=`
- [x] Sidebar + command palette navigation

## UAT

Open `/sources` with `terra_os` selected in sidebar — AfDB + UNECA feeds visible.
