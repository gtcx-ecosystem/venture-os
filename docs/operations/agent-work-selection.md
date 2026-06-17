---
title: 'Agent Work Selection — venture-os'
status: current
date: 2026-06-17
owner: venture-os
document_id: OPS-AWS-AGT-001
document_type: runbook
---

# Agent Work Selection — venture-os

Protocol 22, Protocol 24, Protocol 26, Protocol 27, Protocol 28 in force.

## Protocol 26

Proceed Brief before substantive work; terminal Status Update when `mayCloseTurn`.

## Protocol 27

Agent runs gates in-session; Permission Unblock Report at D6.

## Protocol 28

Authority class R/A/S — Class R: test, lint, build, commit when gates pass.

## Required rule

Never ask the operator to choose among backlog items when P22 returns a story.

## Commands

```bash
pnpm agent:next-work --json
pnpm agent:work-selection:check
```

Roadmap SoR: `pm/execution-roadmap.md` · Backlog: `pm/backlog.json`
