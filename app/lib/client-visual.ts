export type ClientMotif = "land" | "market" | "compliance" | "channel" | "media";

export type ClientVisualTheme = {
  motif: ClientMotif;
  shortLabel: string;
  cardAccentClass: string;
};

const THEMES: Record<string, ClientVisualTheme> = {
  terra_os: {
    motif: "land",
    shortLabel: "Land grid",
    cardAccentClass: "visual-land",
  },
  markets_os: {
    motif: "market",
    shortLabel: "Markets flow",
    cardAccentClass: "visual-market",
  },
  compliance_os: {
    motif: "compliance",
    shortLabel: "Compliance rail",
    cardAccentClass: "visual-channel",
  },
  nyota_ai: {
    motif: "channel",
    shortLabel: "Producer channel",
    cardAccentClass: "visual-channel",
  },
  terminal_os: {
    motif: "media",
    shortLabel: "Intelligence media",
    cardAccentClass: "visual-media",
  },
};

const DEFAULT_THEME: ClientVisualTheme = {
  motif: "channel",
  shortLabel: "Venture desk",
  cardAccentClass: "visual-channel",
};

export function getClientVisualTheme(clientId: string): ClientVisualTheme {
  return THEMES[clientId] ?? DEFAULT_THEME;
}

export function motifClassForVisual(visualClass: string, clientId: string) {
  if (visualClass) return visualClass;
  return getClientVisualTheme(clientId).cardAccentClass;
}
