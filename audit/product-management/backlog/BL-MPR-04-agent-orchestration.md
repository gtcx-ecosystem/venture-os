---
title: 'BL-MPR-04 — Agent orchestration and receipt envelope'
status: intake
date: 2026-06-17
backlog_id: BL-MPR-04
pillar: agenticEmpowerment
priority: P1
promote_to: MPR-04
---

# BL-MPR-04 — Agent orchestration and receipt envelope

**Audit refs:** TE-02 · AE-01 · AE-02 · TS-02

## Problem

`queueWorkflow()` only prepends a local React card.  
`/api/venture/agency` and `/api/venture/griot` exist but Command Center does not call them.  
`ReceiptLog.tsx` and workspace `receipts` state exist but are not surfaced in the agent panel.

## Acceptance

- "Queue workflow" POSTs to agency handoff API with clientId + prompt
- Response appends automation receipt with id, timestamp, authority class
- Agent panel shows receipt log (last 5) with copyable receipt id
- Command palette "Queue workflow" triggers same path (not just `router.push('/')`)
- "Live" badge reflects webhook/health probe (green/amber/red)

## Verification

```bash
curl -s http://localhost:3000/api/health
# manual: queue workflow → receipt visible in UI
```
