import { describe, expect, it } from "vitest";
import { getClientVisualTheme, motifClassForVisual } from "../client-visual";

describe("client-visual", () => {
  it("maps TerraOS to land grid identity", () => {
    expect(getClientVisualTheme("terra_os").motif).toBe("land");
    expect(getClientVisualTheme("terra_os").cardAccentClass).toBe("visual-land");
  });

  it("maps Markets OS to flow identity", () => {
    expect(getClientVisualTheme("markets_os").motif).toBe("market");
    expect(getClientVisualTheme("markets_os").shortLabel).toBe("Markets flow");
  });

  it("falls back when visual class missing", () => {
    expect(motifClassForVisual("", "markets_os")).toBe("visual-market");
  });
});
