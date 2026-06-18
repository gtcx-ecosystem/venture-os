import { describe, expect, it } from "vitest";
import { getFleetClientEntry, listFleetClientEntries } from "../fleet-registry";

describe("fleet-registry", () => {
  it("lists sidebar fleet clients with github URLs", () => {
    const entries = listFleetClientEntries();
    expect(entries.length).toBeGreaterThanOrEqual(5);
    expect(entries[0]?.githubUrl).toMatch(/^https:\/\/github.com\/gtcx-ecosystem\//);
  });

  it("resolves terra_os owner repo", () => {
    const entry = getFleetClientEntry("terra_os");
    expect(entry?.ownerRepo).toBe("terra-os");
    expect(entry?.localPath).toBe("../terra-os");
  });

  it("exposes terminal collateral deep link", () => {
    const entry = getFleetClientEntry("terminal_os");
    expect(entry?.collateralUrl).toContain("terminal-staging");
  });
});
