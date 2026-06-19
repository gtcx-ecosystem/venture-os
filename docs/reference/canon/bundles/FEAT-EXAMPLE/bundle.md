---
title: 'Example feature'
status: draft
date: 2026-06-15
owner: venture-os
tier: operating
tags: ['canon-feature-bundle', 'documentation']
review_cycle: on-change
document_type: canon-feature-bundle
bundleId: FEAT-EXAMPLE
version: 0.1.0
updated: 2026-06-19
---

# Example feature

Narrative context for GitBook and reviewers. Engineering truth is in the `canon-json` blocks below — synthesized to `pm/canon/bundles/FEAT-EXAMPLE/`.

## Charter

```canon-json charter
{
  "$schema": "gtcx://canon-os/product-canon-charter/v1",
  "bundleId": "FEAT-EXAMPLE",
  "version": "0.1.0",
  "problem": "Founders need a single command center for fundraising and growth workflows",
  "goals": ["Pilot routes lint/build green"],
  "nonGoals": ["Full multi-tenant billing"],
  "successMetrics": [
    { "id": "SM-1", "metric": "Golden path e2e", "target": "pass", "verify": "pnpm test:e2e:golden-path" }
  ],
  "dependencies": [],
  "openQuestions": []
}
```

## Requirements

```canon-json requirements
{
  "$schema": "gtcx://canon-os/product-canon-requirements/v1",
  "bundleId": "FEAT-EXAMPLE",
  "version": "0.1.0",
  "functional": [
    {
      "id": "FR-EX-001",
      "statement": "The system SHALL render the founder command center home route",
      "priority": "P0",
      "acceptance": ["Given an authenticated founder When visiting / Then dashboard loads"],
      "surfaces": ["surface-example"],
      "verifyCommand": "pnpm test:e2e:golden-path"
    }
  ],
  "nonFunctional": []
}
```

## Experience

```canon-json experience
{
  "$schema": "gtcx://canon-os/product-canon-experience/v1",
  "bundleId": "FEAT-EXAMPLE",
  "version": "0.1.0",
  "operatorPersonas": ["OP-FOUNDER"],
  "surfaces": [
    {
      "id": "surface-example",
      "route": "/",
      "states": ["idle", "loading", "success", "error"],
      "transitions": [
        { "from": "idle", "event": "submit", "to": "loading" },
        { "from": "loading", "event": "ok", "to": "success" }
      ],
      "acceptance": ["FR-EX-001"]
    }
  ],
  "flows": [{ "id": "flow-example", "steps": ["surface-example:idle", "surface-example:success"] }],
  "narrativeRef": "docs/product/ux/critical-workflows.md"
}
```

## Definition of done

```canon-json dod
{
  "$schema": "gtcx://canon-os/product-canon-dod/v1",
  "bundleId": "FEAT-EXAMPLE",
  "version": "0.1.0",
  "inherits": "agile/scrum/definition-of-done.md",
  "checklist": [
    {
      "id": "DOD-EX-001",
      "item": "All FR-* acceptance verified",
      "verifyCommand": "pnpm test:e2e:golden-path",
      "required": true
    }
  ]
}
```

## UAT

```canon-json uat
{
  "$schema": "gtcx://canon-os/product-canon-uat/v1",
  "bundleId": "FEAT-EXAMPLE",
  "version": "0.1.0",
  "scenarios": [
    {
      "id": "UAT-EX-001",
      "title": "Founder golden path",
      "preconditions": [],
      "steps": ["Sign in", "Open dashboard"],
      "expected": "Dashboard renders without error",
      "verifyCommand": "pnpm test:e2e:golden-path",
      "expectedExitCode": 0
    }
  ]
}
```
