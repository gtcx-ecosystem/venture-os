import { processWorkflowQueue, workflowQueueSchema } from "@/lib/automation/workflow-queue";

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
  return Response.json(result, { status: 201 });
}
