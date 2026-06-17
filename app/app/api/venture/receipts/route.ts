import { getAutomationReceipts } from "@/lib/automation/store";

export async function GET() {
  return Response.json({
    ok: true,
    receipts: getAutomationReceipts().slice(0, 20),
  });
}
