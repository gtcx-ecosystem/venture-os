import { describe, expect, it } from "vitest";
import { heroCopyFromStrategy } from "../automation/canon-strategy-shared";
import { resolveCanonStrategy } from "../automation/canon-strategy";

describe("canon-strategy", () => {
  it("loads strategy for terra_os from live or snapshot", () => {
    const strategy = resolveCanonStrategy("terra_os");
    expect(strategy).not.toBeNull();
    expect(strategy?.vision.statement).toMatch(/TerraOS/i);
    expect(strategy?.mission.length).toBeGreaterThan(20);
    expect(["live", "snapshot"]).toContain(strategy?.source);
  });

  it("returns null for unknown client", () => {
    expect(resolveCanonStrategy("not_a_client")).toBeNull();
  });

  it("prefers vision statement for hero copy", () => {
    const strategy = resolveCanonStrategy("markets_os");
    const copy = heroCopyFromStrategy(strategy, "fallback");
    expect(copy.primary).toMatch(/capital formation/i);
    expect(copy.secondary).toBeTruthy();
  });
});
