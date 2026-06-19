---
title: 'ClickUp board template — Venture OS clients'
status: current
date: 2026-06-17
owner: venture-os
document_type: operating-playbook
tier: tactical
tags: ['venture-os', 'clickup', 'crm', 'managed-service']
review_cycle: on-change
---

# ClickUp board template — Venture OS clients

Per-client ClickUp workspace for warm pilots and managed service delivery. Adapted from the GTCX fundraising engine for multi-client Venture OS.

## Space (per client)

`{Client Name} — Venture OS`

## Folders

| Folder | Purpose |
| ------ | ------- |
| Opportunity Intelligence | Raw and qualified leads across capital, revenue, partners, visibility |
| Capital Pipeline | Investors, DFIs, catalytic capital, grants |
| Growth & Pilots | Paid pilots, buyers, commercial deals |
| Partnerships | Strategic, channel, sovereign, program partners |
| Visibility | Press, content, events, executive audience |
| Collateral Factory | Decks, notes, proposals, proof packs |
| Operating Rhythm | Weekly briefs, digests, research tasks |

## Master list

`Venture Opportunities` — single list for v1 velocity; split only when volume demands.

## Statuses

| Status | Meaning |
| ------ | ------- |
| Inbox | Unreviewed — from Gmail, forms, RSS, manual |
| Qualified | Human-confirmed fit; owner assigned |
| Outreach Ready | Narrative + collateral ready |
| Contacted | First outreach sent |
| Meeting Scheduled | Calendar event linked |
| Diligence | Active evaluation |
| Proposal Submitted | Awaiting decision |
| Won | Closed |
| Lost / Parked | Inactive with revisit date |

## Custom fields (minimum)

| Field | Type |
| ----- | ---- |
| Channel | Dropdown |
| Desk | Dropdown: Capital, Growth, Visibility, Collateral, Partnerships |
| Priority | Dropdown: P1, P2, P3 |
| Fit Score | Number 0–100 |
| Deadline | Date |
| Source URL | URL |
| Gmail Thread ID | Text |
| Calendar Event ID | Text |
| Drive Folder URL | URL |
| Next Action | Long text |
| Approval Required | Checkbox |
| Founder Approved | Checkbox |

## Views

1. **P1 board** — filter Priority = P1, group by Desk
2. **Approvals queue** — Approval Required = true, Founder Approved = false
3. **This week** — Deadline within 7 days
4. **By channel** — group by Channel

## n8n hooks (FOSS rail)

- Gmail inbound → create Inbox task
- Calendar event → Meeting Scheduled + prep task
- Brief publish (approved) → Outreach Ready transition
- Daily digest → Daily Research Ops list

Record real ClickUp space/list IDs in private runtime config — not in git.
