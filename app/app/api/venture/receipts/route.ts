import { getAutomationReceipts } from "@/lib/automation/store";
import { isPostgresDataBackend, listPostgresReceipts } from "@/lib/automation/postgres-store";

export const runtime = "nodejs";

export async function GET() {
  if (isPostgresDataBackend()) {
    return Response.json({
      ok: true,
      backend: "postgres",
      receipts: await listPostgresReceipts(),
    });
  }

  return Response.json({
    ok: true,
    backend: "memory",
    receipts: getAutomationReceipts().slice(0, 20),
  });
}
