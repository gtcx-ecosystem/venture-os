# venture-os — operator onboarding

## Purpose

This repo is part of the GTCX ecosystem. This document is the **operator entry** for builders and agents working in `venture-os`.

## Prerequisites

- Node 20+ with `corepack enable`
- Clone at `../venture-os` relative to ecosystem root
- Read `pm/spec/product-goals.json` for active milestone and shippable outcome

## Quick start

```bash
cd ../venture-os
corepack enable
pnpm install
pnpm ops:check
```

## Shippable contract surfaces

| Surface | Path |
| ------- | ---- |
| Vision / mission / goals | `pm/spec/product-goals.json` |
| PRD index | `pm/product/prd-index.json` |
| Capability matrix | `docs/strategy/product-capability-matrix.md` |
| Demo witness | `audit/evidence/demo-readiness-latest.json` or acceptanceChecks in product-goals |
| QA bar | `audit/evidence/five-pillar-latest.json` |

## Verification

```bash
pnpm ops:check
pnpm product-culture:check
```

## Owner

Product team per `pm/spec/product-goals.json` · Fleet witness: `bridge-os/pm/ci/shippable-contract-fleet-latest.json`

