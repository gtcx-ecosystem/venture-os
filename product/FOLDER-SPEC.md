---
title: "FOLDER-SPEC - product/"
status: current
date: 2026-07-05
owner: venture-os
document_type: folder-spec
tier: critical
tags: ["product", "features", "prd", "registry"]
review_cycle: on-change
---

# FOLDER-SPEC - product/

Normative reference: agile-os `machine/spec/fleet-feature-workflow-provisioning.json`, provisioned by fleet rollout.

## Placement contract

`product/` owns human-readable product intent for venture-os:

- Feature registry and stakeholder-visible feature inventory.
- Feature PRDs under `product/features/`.
- Product goal briefs under `product/goals/` when applicable.
- Business milestone briefs under `product/milestones/` when applicable.

`machine/` owns registry shards, feature records, forensic specs, and audit witnesses.
`delivery/` owns sprint plans and ship handoffs when present.

## Feature definition

A feature is a stakeholder-evaluable capability that changes operator, buyer, agent, admin, compliance, or integration behavior.
