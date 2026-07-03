---
title: 'operations/deploy/ — folder provisioning'
status: current
date: 2026-07-03
owner: venture-os
document_type: folder-spec
tier: operating
tags: ['documentation', 'operations/deploy']
review_cycle: on-change
---

# `docs/operations/deploy/` — provisioning

> **Parent:** [`docs/operations/FOLDER-SPEC.md`](../FOLDER-SPEC.md)

## Purpose

Deployment readiness runbooks, hosting targets, and staging/production witness narratives for Venture OS.

## Agent rules

1. State the credential/network line explicitly; do not claim a deploy without a real deploy witness.
2. Keep environment-specific commands reproducible and cite repo-owned scripts or fabric-os deployment owners.
3. Keep synthetic/demo data labeled as demo-grade and separate from production data claims.
