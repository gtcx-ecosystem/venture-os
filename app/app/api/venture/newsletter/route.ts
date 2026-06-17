import { newsletterSendSchema, processNewsletterSend } from "@/lib/automation/newsletter-send";
import { getClient } from "@/lib/clients";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(request: Request) {
  const secret = process.env.VENTURE_WEBHOOK_SECRET ?? process.env.NEWSLETTER_WEBHOOK_SECRET;
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

  const parsed = newsletterSendSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const client = getClient(parsed.data.clientId);
  if (!client) {
    return Response.json({ error: "Unknown clientId" }, { status: 404 });
  }

  const result = processNewsletterSend(parsed.data);
  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result, { status: result.dryRun ? 200 : 202 });
}
