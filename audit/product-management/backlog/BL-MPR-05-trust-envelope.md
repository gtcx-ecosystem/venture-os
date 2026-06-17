---
title: 'BL-MPR-05 — Trust envelope on claims and publish gates'
status: intake
date: 2026-06-17
backlog_id: BL-MPR-05
pillar: trustAndSafety
priority: P0
promote_to: MPR-05
---

# BL-MPR-05 — Trust envelope on claims and publish gates

**Audit refs:** TS-01..05 · trust pillar 55 · anti-hallucination 30

## Issues

| ID | Issue |
| -- | ----- |
| TS-01 | Opportunity cards show fit scores and pilot claims without `evidenceRef` |
| TS-03 | "Publish brief" has no Class A approval workflow |
| TS-05 | Rolling brief publish path logs "(mock)" |

## Acceptance

- Each opportunity card: `evidenceStatus` chip — `verified` | `needs_proof` | `blocked`
- Claims Reviewer card links to evidence artifact path or inbound proof item
- "Publish brief" routes to `/brief` approvals drawer; blocked until approvals cleared
- External publish requires explicit operator confirm (Class A) with audit log entry
- No user-visible "(mock)" strings in publish flows — use "dry-run" label when applicable

## Data model extension

```ts
type Opportunity = {
  // existing fields
  evidenceRef?: string;
  evidenceStatus?: "verified" | "needs_proof" | "blocked";
};
```
