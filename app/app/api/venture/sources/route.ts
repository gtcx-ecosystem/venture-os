import { listRegisteredClients, listSourcesForClient } from "@/lib/automation/source-registry";

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

  if (clientId) {
    const sources = listSourcesForClient(clientId);
    if (!sources) {
      return Response.json({ error: "Unknown clientId" }, { status: 404 });
    }
    return Response.json({ ok: true, ...sources });
  }

  return Response.json({
    ok: true,
    clients: listRegisteredClients().map((id) => listSourcesForClient(id)!),
  });
}
