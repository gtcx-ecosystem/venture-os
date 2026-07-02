# Flow — founder command center (golden path)

**JTBD:** [jtbd-founder-command-center](../jtbd/jtbd-founder-command-center.json)
**EXR:** [EXR-001](../../../docs/architecture/specs/experiences/EXR-001-founder-command-center.md)

## Steps

1. **Select client** — Sidebar → TerraOS (or other fleet client); `clientId` scopes API.
2. **Review P1 opportunities** — Command Center grid; filter mentally via hero P1 count; inspect `EvidenceChip`.
3. **Queue agent workflow** — `Cmd+K` → Queue workflow → receipt ID in agent panel.
4. **Approve brief for external publish** — `/brief` → Publish → Class A confirm → approvals drawer.

## Error paths

| State | UX |
| ----- | -- |
| API loading | Skeleton / loading copy on grid |
| API error | Inline error with retry hint |
| Empty pipeline | Empty state — queue workflow or check `/sources` |
| Degraded health | Agent panel **Degraded** badge |

## UAT anchor

Staging: `https://venture-staging.gtcx.trade/` after client select + workflow queue.
