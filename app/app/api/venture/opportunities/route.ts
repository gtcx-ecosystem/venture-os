import { listOpportunitiesForClient } from "@/lib/automation/clickup-sync";
import { isPostgresDataBackend, listPostgresOpportunities } from "@/lib/automation/postgres-store";
import { getClient } from "@/lib/clients";

export const runtime = "nodejs";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(request: Request) {
  const secret = process.env.VENTURE_WEBHOOK_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId");
  if (!clientId) {
    return Response.json({ error: "clientId query required" }, { status: 400 });
  }

  const client = getClient(clientId);
  if (!client) {
    return Response.json({ error: "Unknown clientId" }, { status: 404 });
  }

  return Response.json({
    ok: true,
    clientId,
    backend: isPostgresDataBackend() ? "postgres" : "static",
    opportunities: isPostgresDataBackend()
      ? await listPostgresOpportunities(clientId)
      : listOpportunitiesForClient(clientId),
  });
}
