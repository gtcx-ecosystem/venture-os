---
title: 'DEPLOY-01 — Vercel pilot deploy wiring'
status: current
date: 2026-06-17
owner: venture-os
document_type: story
story_id: DEPLOY-01
---

# DEPLOY-01 — Vercel pilot deploy wiring

## Objective

Wire CI, Vercel config, deployment profile, and deploy witness — live URL pending Vercel project import.

## Deliverables

- [x] `app/vercel.json`
- [x] `.github/workflows/ci.yml`
- [x] `docs/operations/deploy/deployment-profile.md`
- [x] `docs/operations/demo-walkthrough.md`
- [x] `audit/evidence/deployment-proof-latest.json` (pending URL)

## Live deploy (Class A — AWS or GCP)

Operator runs ECR push or Cloud Run deploy; agent records URL in deployment witness.

**AWS:** `./deploy/scripts/build-push-ecr.sh` + fabric-os k8s overlay
**GCP:** `./deploy/scripts/deploy-cloud-run.sh`
