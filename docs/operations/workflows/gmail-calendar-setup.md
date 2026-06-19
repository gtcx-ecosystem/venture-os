---
title: 'Gmail and Calendar setup — Venture OS clients'
status: current
date: 2026-06-17
owner: venture-os
document_type: operating-playbook
tier: tactical
tags: ['venture-os', 'gmail', 'calendar', 'google-workspace', 'managed-service']
review_cycle: on-change
---

# Gmail and Calendar setup — Venture OS clients

Day 4 operating setup for warm clients. ClickUp remains source of truth; Gmail and Calendar are the communication layer. Automation via **n8n** (self-hosted, FOSS-first).

## Gmail labels (per client)

Prefix: `VO/{client_slug}/`

| Label | Use |
| ----- | --- |
| `VO/{client}/inbox-opportunities` | Inbound leads requiring triage |
| `VO/{client}/outreach-drafts` | Agent-drafted; founder approval required |
| `VO/{client}/approved-send` | Cleared for outbound |
| `VO/{client}/diligence` | Active investor/partner threads |
| `VO/{client}/visibility` | Press, content, events |
| `VO/{client}/claims-review` | Statements needing proof links |

## Calendar conventions

| Event prefix | Meaning |
| ------------ | ------- |
| `[VO Capital]` | Investor / DFI / grant calls |
| `[VO Growth]` | Pilot / buyer / commercial |
| `[VO Visibility]` | Press, podcast, launch |
| `[VO Internal]` | Founder brief, team sync |

Link each external meeting to a ClickUp task via **Calendar Event ID** custom field.

## Approval gate (non-negotiable)

No message leaves Gmail without:

1. ClickUp task in **Outreach Ready** or **Visibility** equivalent
2. Claims reviewed when external claims present
3. Founder approval recorded (`Founder Approved = true`)
4. Selection receipt logged in Venture OS tool registry (when automated)

## n8n workflows (v1)

| Workflow | Trigger | Action |
| -------- | ------- | ------ |
| `gmail-inbound-to-clickup` | New label `inbox-opportunities` | Create Inbox task |
| `calendar-meeting-prep` | New `[VO *]` event | Create prep task + brief snippet |
| `daily-founder-digest` | Cron 07:00 local | Aggregate P1 + approvals + calendar → brief input |
| `approved-outbound-send` | ClickUp status → Contacted | Send draft from `approved-send` (human gate) |

## Drive folder structure

```
Venture OS / {Client} /
  01-profile/
  02-collateral/
  03-diligence/
  04-outreach/
  05-weekly-briefs/
```

Link folder URL on every ClickUp opportunity.

## Venture OS app mapping

| App surface | Operating layer |
| ----------- | --------------- |
| `/intake` | Day 0 profile capture |
| `/brief` | Rolling founder brief (export/publish) |
| `/tools` | FOSS tool selection + receipts |
| Approvals drawer | Mirrors ClickUp approvals queue |

See also: [`clickup-board-template.md`](./clickup-board-template.md) · [`pilot-onboarding.md`](../../pilot-onboarding.md)
