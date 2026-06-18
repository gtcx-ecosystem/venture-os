export type CanonStrategySummary = {
  productId: string;
  repo: string;
  updated: string;
  vision: { statement: string; horizon?: string };
  mission: string;
  source: "live" | "snapshot";
};

export function heroCopyFromStrategy(
  strategy: CanonStrategySummary | null,
  fallbackOneLiner: string | undefined,
) {
  if (strategy?.vision.statement) {
    return {
      primary: strategy.vision.statement,
      secondary: strategy.mission,
    };
  }
  return {
    primary:
      fallbackOneLiner ??
      "Monitor Africa-focused opportunities, draft investor materials, coordinate agents, and approve external moves without losing the operating thread.",
    secondary: null as string | null,
  };
}
