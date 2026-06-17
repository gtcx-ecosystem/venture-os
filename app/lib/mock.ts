export type OpportunityKind = "capital" | "revenue" | "partner" | "visibility" | "collateral";

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
};

export type ReviewCard = {
  id: string;
  agent: string;
  status: string;
  body: string;
  highlighted?: boolean;
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
    id: "markets-growth-1",
    clientId: "markets_os",
    desk: "growth",
    title: "Refiner paid pilot — copper corridor",
    status: "Commercial scoping",
    horizon: "9d",
    owner: "Growth Desk",
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
    id: "terminal-vis-1",
    clientId: "terminal_os",
    desk: "visibility",
    title: "FIFTY-FOUR intelligence launch",
    status: "Press draft ready",
    horizon: "5d",
    owner: "Visibility Desk",
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
