---
title: 'Design primitive'
status: draft
date: 2026-06-28
owner: venture-os
document_type: overview
tier: operating
tags: ['design', 'primitives', 'mpr']
review_cycle: on-change
---

# Design Primitive

Venture OS uses this primitive to standardize product, operational, and visual design direction for venture operating system workflows, portfolio strategy, investor materials, and product operating cadence.

Canonical source of record: `canon-os/docs/primitives/design/`.

Design documentation lives here. Generated media binaries do not. Media generation and asset inventory stay under `docs/primitives/assets/`, `platform/assets/generated/media/`, and `machine/media/library.manifest.json`.

| Track | Purpose |
| ----- | ------- |
| [Aesthetics](./aesthetics.md) | Visual tone, density, type, color, layout, and imagery. |
| [Comparables](./comparables.md) | Reference products and lessons to adopt or avoid. |
| [Components](./components.md) | Component expectations and interaction patterns. |
| [Goals](./goals.md) | Experience outcomes, quality bar, and design success measures. |
| [Inspiration](./inspiration.md) | Curated moodboard and emerging reference direction. |
| [Motion](./motion.md) | Animation, transitions, motion safety, and code-driven video direction. |
| [Personas](./personas.md) | Design-facing user archetypes and implications. |
| [Platform](./platform.md) | Surface-specific rules across web, mobile, docs, console, and presentations. |
| [Principles](./principles.md) | Durable design laws and decision rules. |
| [Scorecard](./scorecard.md) | Design primitive readiness and MPR rollup. |
| [Tooling Security](./tooling-security.md) | Supply-chain, permission, data, and prompt-injection controls. |
| [Tooling](./tooling.md) | Tool radar for design, asset, motion, and agent-assisted creation. |

## Boundary

`design/` sets design direction. `assets/` governs generated media and asset libraries. Product implementation stays in owner repos.
