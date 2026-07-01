---
title: Venture OS universal agent instructions
status: current
date: 2026-07-01
owner: venture-os
document_type: runbook
tier: operating
tags: ['agent-init', 'qasc', 'fabric-os']
review_cycle: on-change
---

# Venture OS universal agent instructions

All agents operating in `venture-os` use the feature-pack-first workflow:

1. Start from product PRDs and machine-readable feature registry records in `pm/`.
2. Verify each feature through package MPR and SIGNAL evidence.
3. Use feature production packs for acceptance criteria, QA scope, and sprint handoff.
4. Hand implementation sequencing to scrum through `agile/`.

Operational lanes such as GTM, legal, compliance, security, pilot readiness, and partner evidence are tracked through `agile/roadmaps/` and `docs/operations/`. They are auditable workstreams, not product-release blockers unless a product contract explicitly declares them as implementation dependencies.

QASC enforcement is owned by `fabric-os`; local witnesses live in `audit/evidence/` and dated reports live in `audit/reports/`.
