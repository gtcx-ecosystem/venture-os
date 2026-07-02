---
title: 'P4-02 — Signals feed'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: P4-02
---

# P4-02 — Signals feed

## Objective

Product-facing inbound signal feed at `/signals` with source-type filters.

## Acceptance

- [x] `/signals` route
- [x] Filter chips: all · rss · gmail · griot · n8n · manual
- [x] Reuses inbound queue + receipt log

## UAT

POST miniflux/gmail webhooks, open `/signals`, filter `rss`.
