import { agencyHandoffSchema, processAgencyHandoff } from "@/lib/automation/agency-handoff";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(request: Request) {
  const secret = process.env.VENTURE_WEBHOOK_SECRET ?? process.env.AGENCY_HANDOFF_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = agencyHandoffSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const result = processAgencyHandoff(parsed.data);
  return Response.json(result, { status: 201 });
}
