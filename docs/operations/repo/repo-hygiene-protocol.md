---
title: 'Repo hygiene protocol — venture-os'
status: current
date: 2026-06-19
owner: venture-os
document_type: protocol
tier: standard
tags: ['operations', 'repo-hygiene', 'venture-os']
review_cycle: on-change
---

# Repo hygiene protocol — venture-os

**Machine allowlist:** [`root-allowlist.json`](./root-allowlist.json)

## Enforcement

```bash
pnpm ops:check
pnpm workspace:check
```

Root is a closed world — governance docs under `docs/operations/repo/`.
