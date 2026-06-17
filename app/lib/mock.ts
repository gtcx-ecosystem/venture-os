export type OpportunityKind = "capital" | "revenue" | "partner" | "visibility" | "collateral";

export type EvidenceStatus = "verified" | "needs_proof" | "blocked";

export type Opportunity = {
  id: string;
  clientId: string;
  kind: OpportunityKind;
  title: string;
  headline: string;
  description: string;
  priority: string;
  horizon: string;
  fit: string;
  visualClass: string;
  evidenceStatus: EvidenceStatus;
  evidenceRef?: string;
};

export type ReviewCard = {
  id: string;
  agent: string;
  status: string;
  body: string;
  highlighted?: boolean;
  evidenceRef?: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "afdb-dpi",
    clientId: "terra_os",
    kind: "capital",
    title: "afdb digital public infrastructure window terraos",
    headline: "AfDB DPI + land-rights pilot",
    description: "Route TerraOS into sovereign/DFI pilot conversation with bankability proof.",
    priority: "P1",
    horizon: "14d",
    fit: "92 fit",
    visualClass: "visual-land",
    evidenceStatus: "needs_proof",
    evidenceRef: "docs/foundation/milestones.md#m4-golden-transaction",
  },
  {
    id: "terra-bank-insurer",
    clientId: "terra_os",
    kind: "partner",
    title: "terraos bank insurer land credit score partnership",
    headline: "Bank + insurer partnership loop",
    description: "Structure a bank/insurer co-pilot around land credit score + claims evidence reuse.",
    priority: "P2",
    horizon: "30d",
    fit: "83 fit",
    visualClass: "visual-channel",
    evidenceStatus: "needs_proof",
    evidenceRef: "pm/product/prds/prd-land-credit-score.md",
  },
  {
    id: "markets-pilot",
    clientId: "markets_os",
    kind: "revenue",
    title: "markets os buyer refiner trader pilot",
    headline: "Buyer/refiner paid pilot",
    description: "Convert Markets OS proof into a short commercial pilot with clear deal economics.",
    priority: "P1",
    horizon: "9d",
    fit: "88 fit",
    visualClass: "visual-market",
    evidenceStatus: "verified",
    evidenceRef: "audit/evidence/golden-transaction-markets-staging-2026-06-12.json",
  },
  {
    id: "markets-broker-channel",
    clientId: "markets_os",
    kind: "partner",
    title: "markets os broker dealer network channel partners",
    headline: "Broker/dealer channel partners",
    description: "Map broker/dealer networks into a repeatable pilot channel with clear onboarding collateral.",
    priority: "P2",
    horizon: "20d",
    fit: "82 fit",
    visualClass: "visual-channel",
    evidenceStatus: "needs_proof",
    evidenceRef: "docs/business/strategy/channel-partners.md",
  },
  {
    id: "nyota-channel",
    clientId: "nyota_ai",
    kind: "partner",
    title: "nyota telco whatsapp producer network",
    headline: "Producer-channel partnership",
    description: "Package Nyota for telco, NGO, and mobile-money distribution partners.",
    priority: "P2",
    horizon: "21d",
    fit: "84 fit",
    visualClass: "visual-channel",
    evidenceStatus: "needs_proof",
  },
  {
    id: "nyota-program",
    clientId: "nyota_ai",
    kind: "revenue",
    title: "nyota producer intelligence program paid pilot",
    headline: "Program-paid pilot (NGO/DFI)",
    description: "Convert producer intelligence into a program-funded pilot with measurable outcomes.",
    priority: "P1",
    horizon: "16d",
    fit: "85 fit",
    visualClass: "visual-market",
    evidenceStatus: "verified",
    evidenceRef: "docs/foundation/goals.md",
  },
  {
    id: "fifty-four-press",
    clientId: "terminal_os",
    kind: "visibility",
    title: "fifty four griot african commodity intelligence press",
    headline: "Africa commodity intelligence launch",
    description: "Turn FIFTY-FOUR + Griot into press, LinkedIn, and executive audience growth.",
    priority: "P1",
    horizon: "5d",
    fit: "90 fit",
    visualClass: "visual-media",
    evidenceStatus: "needs_proof",
    evidenceRef: "docs/product/ux/visibility-desk.md",
  },
  {
    id: "terminal-exec-briefs",
    clientId: "terminal_os",
    kind: "visibility",
    title: "terminal os executive briefs corridor intelligence",
    headline: "Weekly executive brief pipeline",
    description: "Ship a weekly corridor/country intelligence brief and build subscriber growth loops.",
    priority: "P2",
    horizon: "10d",
    fit: "81 fit",
    visualClass: "visual-media",
    evidenceStatus: "verified",
    evidenceRef: "docs/foundation/roadmap.md",
  },
  {
    id: "compliance-enterprise",
    clientId: "compliance_os",
    kind: "revenue",
    title: "compliance os enterprise buyer pilot",
    headline: "Enterprise compliance pilot",
    description: "Convert Core12 trust layer into a paid enterprise compliance pilot with evidence reuse.",
    priority: "P1",
    horizon: "18d",
    fit: "86 fit",
    visualClass: "visual-market",
    evidenceStatus: "verified",
    evidenceRef: "docs/foundation/constitution.md",
  },
  {
    id: "compliance-standards-body",
    clientId: "compliance_os",
    kind: "partner",
    title: "compliance os standards body auditor partnership",
    headline: "Auditor + standards body partners",
    description: "Open an auditor/standards partnership lane to validate Core12 evidence reuse and scoring.",
    priority: "P2",
    horizon: "24d",
    fit: "80 fit",
    visualClass: "visual-channel",
    evidenceStatus: "blocked",
    evidenceRef: "docs/compliance/standards-body-partnership.md",
  },
];

export type DeskKind = "capital" | "growth" | "visibility" | "collateral";

export type PipelineItem = {
  id: string;
  clientId: string;
  desk: DeskKind;
  title: string;
  status: string;
  horizon: string;
  owner: string;
};

export const PIPELINE_ITEMS: PipelineItem[] = [
  {
    id: "terra-cap-1",
    clientId: "terra_os",
    desk: "capital",
    title: "AfDB DPI land-rights pilot window",
    status: "Drafting concept note",
    horizon: "14d",
    owner: "Capital Desk",
  },
  {
    id: "terra-cap-2",
    clientId: "terra_os",
    desk: "capital",
    title: "Catalytic capital follow-on",
    status: "Investor mapping",
    horizon: "28d",
    owner: "Capital Desk",
  },
  {
    id: "terra-growth-1",
    clientId: "terra_os",
    desk: "growth",
    title: "Bankability proof path — land credit score MVP",
    status: "Scoping pilot KPIs",
    horizon: "22d",
    owner: "Growth Desk",
  },
  {
    id: "markets-growth-1",
    clientId: "markets_os",
    desk: "growth",
    title: "Refiner paid pilot — copper corridor",
    status: "Commercial scoping",
    horizon: "9d",
    owner: "Growth Desk",
  },
  {
    id: "markets-cap-1",
    clientId: "markets_os",
    desk: "capital",
    title: "Market-infrastructure investor shortlist",
    status: "Investor mapping",
    horizon: "21d",
    owner: "Capital Desk",
  },
  {
    id: "compliance-growth-1",
    clientId: "compliance_os",
    desk: "growth",
    title: "Enterprise buyer compliance pilot",
    status: "Needs proof pack",
    horizon: "18d",
    owner: "Growth Desk",
  },
  {
    id: "compliance-cap-1",
    clientId: "compliance_os",
    desk: "capital",
    title: "Enterprise/regtech capital narrative refresh",
    status: "Drafting memo",
    horizon: "26d",
    owner: "Capital Desk",
  },
  {
    id: "terminal-vis-1",
    clientId: "terminal_os",
    desk: "visibility",
    title: "FIFTY-FOUR intelligence launch",
    status: "Press draft ready",
    horizon: "5d",
    owner: "Visibility Desk",
  },
  {
    id: "terminal-cap-1",
    clientId: "terminal_os",
    desk: "capital",
    title: "Media + intelligence sponsorship pipeline",
    status: "Partner mapping",
    horizon: "15d",
    owner: "Capital Desk",
  },
  {
    id: "nyota-vis-1",
    clientId: "nyota_ai",
    desk: "visibility",
    title: "Producer network channel story",
    status: "Queued",
    horizon: "12d",
    owner: "Visibility Desk",
  },
  {
    id: "nyota-growth-1",
    clientId: "nyota_ai",
    desk: "growth",
    title: "Telco channel pilot — producer intelligence",
    status: "Drafting outreach list",
    horizon: "16d",
    owner: "Growth Desk",
  },
  {
    id: "terra-col-1",
    clientId: "terra_os",
    desk: "collateral",
    title: "TerraOS DFI concept note",
    status: "Claims review",
    horizon: "3d",
    owner: "Collateral Factory",
  },
  {
    id: "markets-col-1",
    clientId: "markets_os",
    desk: "collateral",
    title: "Buyer pilot one-pager",
    status: "Draft ready",
    horizon: "2d",
    owner: "Collateral Factory",
  },
  {
    id: "compliance-col-1",
    clientId: "compliance_os",
    desk: "collateral",
    title: "Enterprise pilot proof pack",
    status: "Needs sources",
    horizon: "6d",
    owner: "Collateral Factory",
  },
  {
    id: "terminal-col-1",
    clientId: "terminal_os",
    desk: "collateral",
    title: "FIFTY-FOUR sponsor one-pager",
    status: "Draft ready",
    horizon: "4d",
    owner: "Collateral Factory",
  },
  {
    id: "nyota-col-1",
    clientId: "nyota_ai",
    desk: "collateral",
    title: "Telco/NGO partnership deck",
    status: "Queued",
    horizon: "7d",
    owner: "Collateral Factory",
  },
];

export const INITIAL_REVIEWS: ReviewCard[] = [
  {
    id: "capital-draft",
    agent: "Capital Desk Agent",
    status: "Draft ready",
    body: "TerraOS concept note mapped to DFI pilot, land-credit score, and bank/insurer outcomes.",
    highlighted: true,
  },
  {
    id: "claims",
    agent: "Claims Reviewer",
    status: "Needs proof",
    body: "Three claims require evidence links before external use.",
    evidenceRef: "docs/foundation/milestones.md#m4-golden-transaction",
  },
  {
    id: "visibility",
    agent: "Visibility Desk",
    status: "Queued",
    body: "LinkedIn launch post for FIFTY-FOUR intelligence surface.",
  },
];

export const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "capital", label: "Capital" },
  { id: "revenue", label: "Revenue" },
  { id: "partner", label: "Partners" },
  { id: "visibility", label: "Visibility" },
  { id: "collateral", label: "Collateral" },
] as const;

export type CalendarEvent = {
  id: string;
  clientId: string;
  day: string;
  title: string;
  detail: string;
};

export type ApprovalItem = {
  id: string;
  clientId: string;
  kind: string;
  status: string;
  body: string;
  highlighted?: boolean;
};

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "terra-call",
    clientId: "terra_os",
    day: "Wed",
    title: "DFI program officer call",
    detail: "15:00 · prep approvals",
  },
  {
    id: "terra-deadline",
    clientId: "terra_os",
    day: "Fri",
    title: "Concept note v1 deadline",
    detail: "Send after claims proof",
  },
  {
    id: "terra-intros",
    clientId: "terra_os",
    day: "Mon",
    title: "Warm intros (5)",
    detail: "Partner mapping complete",
  },
  {
    id: "markets-pilot-review",
    clientId: "markets_os",
    day: "Thu",
    title: "Refiner pilot scoping call",
    detail: "Commercial terms review",
  },
];

export const APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: "claims",
    clientId: "terra_os",
    kind: "Claims review",
    status: "Needs proof",
    body: "Three statements require evidence links before outbound use.",
    highlighted: true,
  },
  {
    id: "outreach",
    clientId: "terra_os",
    kind: "Outreach email",
    status: "Ready",
    body: "DFI program officer intro — approve wording and send.",
  },
  {
    id: "press",
    clientId: "terminal_os",
    kind: "Press draft",
    status: "Review",
    body: "Launch post for intelligence surface — needs approval.",
  },
];
