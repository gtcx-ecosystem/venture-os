---
title: 'Venture OS Data Model'
status: current
date: 2026-06-17
owner: ecosystem-os
document_type: data-model
tier: strategic
tags: ['venture-os', 'data-model', 'schema']
review_cycle: weekly
---

# Venture OS Data Model

## Core Entities

| Entity | Description |
| ------ | ----------- |
| Client | Startup, product, venture studio company, accelerator cohort, fund portfolio company, or ecosystem program |
| Product | Client product/offering that maps to buyers, funders, partners, and collateral |
| Source | Web link, organization, feed, newsletter, LinkedIn/manual source, event, or database |
| Signal | Raw captured item from a source |
| Opportunity | Pursuable capital, revenue, partnership, visibility, program, or investor item |
| Organization | Fund, DFI, foundation, buyer, bank, government agency, corporate, accelerator, media outlet |
| Contact | Person attached to an organization or warm-intro path |
| Relationship | Connection between client/contact/organization/opportunity |
| Deliverable | Deck, one-pager, concept note, proposal, application, press asset, investor update |
| Approval | Human decision record for external action, claim, submission, financial/legal term |
| Activity | Email, meeting, call, LinkedIn touch, WhatsApp touch, submission, follow-up |
| Metric | Funding, revenue, pipeline, visibility, growth, traction, and operating KPIs |

## Client Fields

| Field | Purpose |
| ----- | ------- |
| `client_id` | Stable identifier |
| `name` | Company/product/cohort name |
| `segment` | Startup, studio, accelerator, fund, ecosystem hub, corporate program |
| `geographies` | Countries/regions of operation |
| `sectors` | Primary sectors |
| `stage` | Idea, MVP, pilot, revenue, growth, scale |
| `capital_goal` | Amount/type/timeline |
| `revenue_goal` | Revenue/pilot/commercial target |
| `visibility_goal` | Press/events/audience target |
| `primary_products` | Products/offers Venture OS can route opportunities to |
| `positioning` | Core narrative |
| `proof_points` | Traction, metrics, pilots, partners, evidence |
| `constraints` | Legal, regulatory, claims, confidentiality, geography, funding restrictions |
| `systems` | ClickUp/Gmail/Calendar/Drive/app links |

## Opportunity Types

| Type | Examples |
| ---- | -------- |
| Capital | Grant, VC, angel, DFI, foundation, challenge, accelerator, catalytic capital |
| Revenue | Buyer, enterprise sale, paid pilot, procurement, channel, license |
| Partnership | DFI, bank, telco, university, government, NGO, corporate, trade body |
| Visibility | Press, award, event, podcast, LinkedIn campaign, newsletter, report |
| Investor | Warm intro, direct outreach, update, diligence, term discussion |
| Collateral | Deck, proposal, one-pager, concept note, data room |
| Program | Incubator, accelerator, startup challenge, technical assistance |

## Opportunity Fields

| Field | Purpose |
| ----- | ------- |
| `opportunity_id` | Stable identifier |
| `client_id` | Owning client |
| `type` | Capital/revenue/partnership/visibility/investor/collateral/program |
| `title` | Human-readable opportunity name |
| `source_url` | Evidence URL |
| `source_excerpt` | Source snippet |
| `organization_id` | Primary organization |
| `contacts` | Associated people |
| `geography` | Country/region/global |
| `amount_or_value` | Funding amount, revenue value, program value, or estimated value |
| `deadline` | Deadline or next milestone |
| `fit_score` | 0-100 |
| `effort_score` | 0-100 |
| `priority` | P0/P1/P2/P3 |
| `stage` | Signal through won/lost |
| `owner` | Accountable person/agent |
| `next_action` | Concrete next step |
| `approval_state` | Not needed, pending, approved, rejected |

## System Of Record By Phase

| Phase | Intelligence SoR | Execution SoR | Communication SoR |
| ----- | ---------------- | ------------- | ----------------- |
| V0 Internal | Markdown/JSON | ClickUp | Gmail/Calendar/Drive |
| V1 Managed Service | JSON/Postgres-lite | ClickUp | Gmail/Calendar/Drive/n8n |
| V2 App MVP | Postgres app | ClickUp sync | Gmail/Calendar APIs |
| V3 Platform | Venture OS app | Venture OS + integrations | Embedded inbox/calendar integrations |

## Dedupe Keys

Signals and opportunities should dedupe by:

1. Source URL.
2. Source-specific ID.
3. Organization + title + deadline.
4. Contact email or LinkedIn URL.
5. Program/event name + year.
6. Gmail thread ID.
