import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { test, expect, type Page } from "@playwright/test";

const WITNESS_DIR = join(process.cwd(), "..", "audit", "evidence");

async function witnessStep(page: Page, step: string) {
  if (process.env.GOLDEN_PATH_WRITE !== "1") return;
  mkdirSync(WITNESS_DIR, { recursive: true });
  await page.screenshot({
    path: join(WITNESS_DIR, `golden-path-${step}.png`),
    fullPage: true,
  });
}

test.describe("Command Center golden path (MPR-08)", () => {
  test("TerraOS → Capital filter → queue workflow → brief publish gate", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("region", { name: "Founder command center" })).toBeVisible();
    await witnessStep(page, "01-command-center");

    await expect(
      page.getByLabel("Workspace navigation").getByRole("button", { name: "TerraOS", exact: true }),
    ).toHaveClass(/is-selected/);

    await page.getByRole("button", { name: "Capital", exact: true }).click();
    await expect(page.locator("#opportunityGrid .opportunity-card[data-kind='capital']")).toHaveCount(1);
    await witnessStep(page, "02-capital-filter");

    await page.locator("#runAgent").click();
    await expect(page.getByLabel("Automation receipts")).toContainText(/workflow queued/i, {
      timeout: 15_000,
    });
    await witnessStep(page, "03-workflow-receipt");

    await page.goto("/intake");
    await page.getByRole("button", { name: "Save intake and open brief" }).click();
    await expect(page).toHaveURL(/\/brief$/);
    await expect(page.getByLabel("Client workflow progress").getByText("Approve")).toHaveClass(/is-active/);
    await witnessStep(page, "04-rolling-brief");

    const drawer = page.getByRole("complementary", { name: "Approvals drawer" });
    await page.getByRole("button", { name: /Approvals/ }).click();
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Claims review")).toBeVisible();
    await witnessStep(page, "05-approvals-drawer");

    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByText("Publish blocked — approvals pending.")).toBeVisible();
    await expect(drawer).toBeVisible();
    await witnessStep(page, "06-publish-blocked");

    if (process.env.GOLDEN_PATH_WRITE === "1") {
      const manifest = {
        schema: "gtcx.goldenPathWitness.v1",
        story: "MPR-08",
        at: new Date().toISOString(),
        steps: [
          "command-center",
          "capital-filter",
          "workflow-receipt",
          "rolling-brief",
          "approvals-drawer",
          "publish-blocked",
        ],
        screenshots: [
          "golden-path-01-command-center.png",
          "golden-path-02-capital-filter.png",
          "golden-path-03-workflow-receipt.png",
          "golden-path-04-rolling-brief.png",
          "golden-path-05-approvals-drawer.png",
          "golden-path-06-publish-blocked.png",
        ].filter((name) => existsSync(join(WITNESS_DIR, name))),
      };
      await page.evaluate(() => undefined);
      const { writeFileSync } = await import("node:fs");
      writeFileSync(
        join(WITNESS_DIR, "golden-path-latest.json"),
        `${JSON.stringify(manifest, null, 2)}\n`,
      );
    }
  });
});
