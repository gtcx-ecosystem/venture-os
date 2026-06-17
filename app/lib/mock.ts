export type OpportunityKind = "capital" | "revenue" | "partner" | "visibility" | "collateral";

export type Opportunity = {
  id: string;
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
    kind: "visibility",
    title: "fifty four griot african commodity intelligence press",
    headline: "Africa commodity intelligence launch",
    description: "Turn FIFTY-FOUR + Griot into press, LinkedIn, and executive audience growth.",
    priority: "P1",
    horizon: "5d",
    fit: "90 fit",
    visualClass: "visual-media",
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
