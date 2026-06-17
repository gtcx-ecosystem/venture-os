---
title: 'Docs root — folder provisioning spec'
status: current
date: 2026-06-15
owner: venture-os
document_type: folder-spec
tier: critical
tags: ['documentation', 'agents', 'provisioning']
review_cycle: on-change
goals: 'Agents provision docs/ without random folders — product profile'
---

# `docs/` — root provisioning (venture-os)

> **Profile:** `product` · **Registry:** `canon-os/pm/spec/docs-folder-provisioning.json`

## Purpose

Repo-scoped documentation for **venture-os**. Read `INDEX.md` before creating paths.

## Top-level folders (current)

| Folder | Purpose | `document_type` |
| ------ | ------- | ------------------ |
| `superpowers/` | Repo-scoped documentation | per profile |

## Required root files

`README.md` · `INDEX.md` · `sor.json` · `conventions.md` · `CHANGELOG.md` · `FOLDER-SPEC.md`

## Forbidden

- New top-level folders without `CHANGELOG.md` entry + profile check
- P29 ops domains under `docs/` (`compliance/`, `gtm/`, `security/`) — use `ops/`
- Version path tokens (`-v2`, `v3/`) — Protocol 47
- Numbered root hubs (`01-docs/`, `03-platform/`) — use `docs/` + `pm/` per P35 v5

## Agent rules

1. Read `docs/INDEX.md` and this file first
2. Set `document_type` in frontmatter per `canon-os/pm/spec/docs-document-types.json`
3. Add `README.md` with every new directory
4. Log structural changes in `CHANGELOG.md`
