import { resolveCanonStrategy } from "@/lib/automation/canon-strategy";
import { getFleetClientEntry } from "@/lib/fleet-registry";

type RouteContext = { params: Promise<{ clientId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { clientId } = await context.params;
  const fleet = getFleetClientEntry(clientId);

  if (!fleet) {
    return Response.json({ error: `Unknown fleet client: ${clientId}` }, { status: 404 });
  }

  const strategy = resolveCanonStrategy(clientId);
  if (!strategy) {
    return Response.json({ error: "Strategy not found" }, { status: 404 });
  }

  return Response.json({
    ok: true,
    clientId,
    fleet: {
      ownerRepo: fleet.ownerRepo,
      githubUrl: fleet.githubUrl,
      localPath: fleet.localPath,
      collateralUrl: fleet.collateralUrl ?? null,
      canonStrategyPath: fleet.canonStrategyPath,
    },
    strategy,
  });
}
