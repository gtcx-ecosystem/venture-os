---
title: 'FOLDER-SPEC — 01-docs'
status: current
date: 2026-06-17
owner: venture-os
document_type: folder-spec
tier: operating
---

# FOLDER-SPEC — `01-docs/`

P35 numbered layers in use for venture-os delivery docs.

## Layers

| Folder | Contents |
| ------ | -------- |
| `04-ops/` | Day 4 operating system: workflows, templates, n8n manifests |
| `05-audit/` | `execution-roadmap.md`, `stories/S*-*.md`, `backlog/BL-*-*.md` |

## Naming

- **Stories:** `05-audit/stories/S{n}-{nn}-{slug}.md` (matches roadmap `S8-01`)
- **Backlog intake:** `05-audit/backlog/BL-{DOMAIN}-{nn}-{slug}.md`

## Forbidden

- Unnumbered top-level folders under `01-docs/` (use `04-ops` or `05-audit`)
- Duplicate execution-roadmap outside `05-audit/` without `pm/` pointer
