import { processWorkflowQueue, workflowQueueSchema } from "@/lib/automation/workflow-queue";
import {
  insertPostgresReceipt,
  isPostgresDataBackend,
  listPostgresReceipts,
} from "@/lib/automation/postgres-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = workflowQueueSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const result = processWorkflowQueue(parsed.data);
  if (isPostgresDataBackend()) {
    await Promise.all(result.receipts.map((receipt) => insertPostgresReceipt(receipt)));
    return Response.json({ ...result, backend: "postgres", receipts: await listPostgresReceipts() }, { status: 201 });
  }

  return Response.json({ ...result, backend: "memory" }, { status: 201 });
}
