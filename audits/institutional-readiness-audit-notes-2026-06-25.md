# VentureOS Institutional Readiness Audit Notes

Date: 2026-06-25

Auditor lens: not "can it demo?" but "can this help a financial institution, ministry, regulator, or government team adopt working capability inside a 90-day controlled rollout?" Adoption labels A1 (institution-adoptable) / A2 (pilotable with support) / A3 (internal/commercial support) / A4 (peripheral/experimental). Claims discipline: no "bank-grade" / "enterprise" language without SOC2 + pen-test + DPA + SSO.

## Verdict

| Dimension | Assessment |
| --------- | ---------- |
| Score | 4 / 10 |
| Adoption label | A3 — internal/commercial support (held) |
| GTM stage (machine) | S2 Pilot Ready, `not_ready`, score 50/100 |
| Engineering maturity lane | 23/100, MPR not published |
| Procurement assurance | All segments `not_ready` (enterprise/gov/defense) |
| Deployment | Live — AWS EKS staging, health 200 |
| Merge gate (`ops:check`) | FAIL (lint regression) |
| Net direction | Capability matured; two fresh red gates |

Scope (from README + `machine/spec/product-goals.json`): VentureOS is the productized GTCX fundraising engine — an Africa-focused founder command center (Capital Desk + Growth Desk + Visibility Desk) for founders, studios, accelerators, and funds. GTCX ecosystem repos are the first pilot clients. It is a venture-formation / capital-narrative product, not an institutional workflow product. Under the institutional-adoption lens it remains a commercial enabler, not a capability a regulator or ministry would itself adopt.

## Delta since 2026-06-24

Prior audit (`institutional-readiness-audit-notes-2026-06-24.md`) was qualitative only: label **A3**, no numeric score, three priority gaps (connect venture planning to product adoption bundles; track implementation economics; avoid investor narrative outrunning evidence).

Changes observed this cycle:

- New: live AWS EKS staging deployment confirmed (`audit/evidence/deployment-proof-latest.json`, health 200, opportunities 200), 6-step golden-path E2E witness with screenshots (`golden-path-latest.json`), formalized `product-goals.json` (PG1–PG3), composite audit 80/100.
- Regression: `pnpm lint` now FAILS (2 `react-hooks/set-state-in-effect` errors) → `ops:check` FAILS. The GTM witness still records `opsCheckPass: true` (stale vs. current tree).
- Still open: north-star pilot-journey witness (`audit/evidence/venture-pilot-journey-latest.json`) does not exist; PG2 unproven.

Net: more real shipping evidence than the prior qualitative note implied, offset by a fresh merge-gate regression and an unmet north-star. Label A3 held; numeric anchored at 4/10 because the product is peripheral to the FI/ministry/regulator adoption target and the merge gate is currently red.

## What is defensible today (evidence)

- App builds: `pnpm build` exit 0 — ~20 routes + venture API surface (`/api/venture/opportunities`, `/sources`, `/receipts`, `/workflow/queue`).
- Unit tests: `pnpm test` exit 0.
- Live staging: `venture-staging.gtcx.trade/api/health` 200, ECR image `gtcx-venture-os:3943cb2`, EKS namespace `venture-os-staging`, ExternalSecret SecretSynced=True.
- Golden-path UX flow witnessed end-to-end: command-center → capital-filter → workflow-receipt → rolling-brief → approvals-drawer → publish-blocked.
- Governance posture sound: PG3 enforces human-gated external sends (no autonomous outreach).
- Rich commercial layer: ICP, personas, pricing, business-model, revenue-streams under `docs/business/`.
- Docs product gate green: `pnpm docs:product:check` PASS 27/27.

## Gaps (priority, IDs)

1. **P0 — GAP-VOS-LINT-01:** `pnpm lint` exit 1 (2 `react-hooks/set-state-in-effect` errors in a strategy hook) → `ops:check` FAIL. Blocks the repo's own merge gate; contradicts the stale `opsCheckPass: true` witness.
2. **P1 — GAP-VOS-PILOT-02:** North-star witness `audit/evidence/venture-pilot-journey-latest.json` missing. PG2 ("ecosystem repos as pilot clients, 1 end-to-end pilot journey") is unproven; no repeatable client-onboarding evidence beyond `schema/client.schema.json`.
3. **P1 — GAP-VOS-OPS-03:** Workspace/coordination drift — `docs/operations/workspace/ecosystem-repo-layout-v5.md` missing, `agent-work-selection` manifest missing, coordination doc lacks Protocol 24. `ops:check` enumerates all three.
4. **P2 — GAP-VOS-GTM-04:** GTM S2 `not_ready` — `demoWalkthrough`, `syntheticFixtures`, `featureMatrix90`, `deployWitness` (gate), `repeatableOnboarding`, `slaDefined`, `apiVersioned` all false (score 50/100).
5. **P2 — GAP-VOS-DOC-05:** README links `docs/product/product-spec.md` and `implementation-roadmap.md` that are not present at those paths (doc drift).

## Candid opinion

VentureOS is technically more real than its prior qualitative note suggested — it builds, tests, deploys to live staging, and has a witnessed UX golden path. But it answers a different question than this audit asks. The institutional-adoption lens is about a regulator/ministry/FI adopting working capability; VentureOS is a founder/fund-facing capital-and-growth command center. Its honest role is unchanged: it helps GTCX package, finance, and sequence the ecosystem commercially. That value only converts if it produces repeatable deployment economics and a proven pilot journey — neither of which is witnessed yet (PG2 empty). Meanwhile the current lint/ops regression means the repo cannot pass its own merge gate today; fix that before any external pilot framing. Do not let a polished investor/founder surface outrun the missing pilot-journey evidence.

## Claims discipline

- Permitted: "live staging deployment," "builds and tests green," "governed (human-gated) workflows," "golden-path UX witnessed."
- Forbidden until evidenced: "bank-grade," "enterprise-ready," "production-ready for institutional procurement." `gtm-readiness-latest.json` shows SOC2, pen-test, DPA, privacy policy, SSO, and audit-log all `false` across enterprise/government/defense segments. No institutional procurement claim is defensible.
- "Production-ready: true" in `composite-audit-latest.json` is a soft signal (cores `pending-full-audit`) and must not be cited as institutional readiness.

## Strongest 90-day deal

Internal/commercial: run one GTCX ecosystem repo (e.g. terra-os) as a live pilot client through the witnessed golden path — intake → collateral → visibility — and emit the missing `venture-pilot-journey-latest.json` as proof. This is an internal capital-formation/portfolio enabler, not an externally procurable institutional deployment. Buyer is GTCX itself / venture-studio operators, not an FI or ministry.

## Roadmap linkage

- `activeMilestone` M1 — "Venture OS MVP + GTCX pilot shell," head story `VENTURE-MVP-001`, programme `PROG-CONTINENTAL-CAPITAL`, target 2026-Q3.
- Close-out for M1 acceptance requires GAP-VOS-LINT-01 (restores `culture-check`/`app-build` gate integrity) and GAP-VOS-PILOT-02 (north-star witness).
- GTM advance S2→S3 gated by GAP-VOS-GTM-04 (demo walkthrough, synthetic fixtures, feature matrix, deploy witness).

## Machine gates (commands run + exit codes)

| Command | Exit | Result |
| ------- | ---- | ------ |
| `pnpm gtm:readiness:check` | 254 | Script not present in this repo (command not found) — read witness `audit/evidence/gtm-readiness-latest.json` instead |
| `pnpm docs:ia:check` | 254 | Script not present (suggested `docs:agile:check`) |
| `pnpm build` | 0 | PASS — full route + API build |
| `pnpm test` | 0 | PASS |
| `pnpm lint` | 1 | FAIL — 2 `react-hooks/set-state-in-effect` errors |
| `pnpm ops:check` | (fail) | FAIL — lint + layout-v5 + work-selection + P24 coordination |
| `pnpm docs:product:check` | 0 | PASS 27/27 |
| `git log --oneline -15` | 0 | HEAD `01d9208` (audit/witness refresh churn) |

Witness reads: `gtm-readiness-latest.json` (S2, 50/100, all procurement gates false), `composite-audit-latest.json` (80/100, cores pending), `deployment-proof-latest.json` (live staging, health 200), `golden-path-latest.json` (6-step E2E), `product-goals.json` (PG1–PG3). North-star witness `venture-pilot-journey-latest.json` absent.
