import { spawn } from "node:child_process";
import { createAutomationReceipt, type AutomationReceipt } from "./receipts";
import { ingestCandidate, listNewCandidates, type InboundCandidate, type InboundPayload } from "./inbound";
import type { Opportunity } from "@/lib/mock";

function sqlLiteral(value: string | null | undefined) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

function jsonLiteral(value: unknown) {
  return `${sqlLiteral(JSON.stringify(value))}::jsonb`;
}

export function isPostgresDataBackend() {
  return process.env.VENTURE_DATA_BACKEND === "postgres" && Boolean(process.env.DATABASE_URL);
}

async function queryJson<T>(sql: string): Promise<T> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required for postgres data backend");

  return new Promise((resolve, reject) => {
    const child = spawn(
      "psql",
      ["-X", "--quiet", "--tuples-only", "--no-align", "--set", "ON_ERROR_STOP=1", databaseUrl, "-c", sql],
      { env: { ...process.env, PAGER: "cat" } },
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `psql exited ${code}`));
        return;
      }
      const text = stdout.trim();
      if (!text) {
        resolve(null as T);
        return;
      }
      try {
        resolve(JSON.parse(text) as T);
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function execute(sql: string) {
  await queryJson<unknown>(`
    WITH executed AS (
      ${sql}
      RETURNING 1
    )
    SELECT 'null'::json::text;
  `);
}

export async function listPostgresOpportunities(clientId: string): Promise<Opportunity[]> {
  return queryJson<Opportunity[]>(`
    SELECT COALESCE(json_agg(row_to_json(items)), '[]'::json)::text
    FROM (
      SELECT
        id,
        client_id AS "clientId",
        kind,
        title,
        headline,
        description,
        priority,
        horizon,
        fit,
        visual_class AS "visualClass",
        evidence_status AS "evidenceStatus",
        evidence_ref AS "evidenceRef"
      FROM venture_opportunities
      WHERE client_id = ${sqlLiteral(clientId)}
      ORDER BY priority ASC, horizon ASC, id ASC
    ) items;
  `);
}

export async function listPostgresInboundCandidates(clientId?: string): Promise<InboundCandidate[]> {
  const where = clientId ? `WHERE client_id = ${sqlLiteral(clientId)}` : "";
  return queryJson<InboundCandidate[]>(`
    SELECT COALESCE(json_agg(row_to_json(items)), '[]'::json)::text
    FROM (
      SELECT
        id,
        dedupe_key AS "dedupeKey",
        received_at AS "receivedAt",
        status,
        payload
      FROM venture_inbound_candidates
      ${where}
      ORDER BY received_at DESC
      LIMIT 100
    ) items;
  `);
}

export async function listPostgresReceipts(): Promise<AutomationReceipt[]> {
  return queryJson<AutomationReceipt[]>(`
    SELECT COALESCE(json_agg(row_to_json(items)), '[]'::json)::text
    FROM (
      SELECT
        id,
        "timestamp",
        kind,
        actor,
        client_id AS "clientId",
        summary,
        metadata
      FROM venture_automation_receipts
      ORDER BY "timestamp" DESC
      LIMIT 20
    ) items;
  `);
}

export async function insertPostgresInboundCandidate(candidate: InboundCandidate) {
  const payload = candidate.payload;
  await execute(`
    INSERT INTO venture_inbound_candidates (
      id, dedupe_key, received_at, status, client_id, source, title, kind,
      urgency, external_id, body, payload
    ) VALUES (
      ${sqlLiteral(candidate.id)},
      ${sqlLiteral(candidate.dedupeKey)},
      ${sqlLiteral(candidate.receivedAt)}::timestamptz,
      ${sqlLiteral(candidate.status)},
      ${sqlLiteral(payload.clientId)},
      ${sqlLiteral(payload.source)},
      ${sqlLiteral(payload.title)},
      ${sqlLiteral(payload.kind)},
      ${sqlLiteral(payload.urgency)},
      ${sqlLiteral(payload.externalId)},
      ${sqlLiteral(payload.body)},
      ${jsonLiteral(payload)}
    )
    ON CONFLICT (id, received_at) DO UPDATE SET
      status = EXCLUDED.status,
      payload = EXCLUDED.payload
  `);
}

export async function insertPostgresReceipt(receipt: AutomationReceipt) {
  await execute(`
    INSERT INTO venture_automation_receipts (
      id, "timestamp", kind, actor, client_id, summary, metadata
    ) VALUES (
      ${sqlLiteral(receipt.id)},
      ${sqlLiteral(receipt.timestamp)}::timestamptz,
      ${sqlLiteral(receipt.kind)},
      ${sqlLiteral(receipt.actor)},
      ${sqlLiteral(receipt.clientId)},
      ${sqlLiteral(receipt.summary)},
      ${jsonLiteral(receipt.metadata ?? {})}
    )
    ON CONFLICT (id, "timestamp") DO UPDATE SET
      kind = EXCLUDED.kind,
      summary = EXCLUDED.summary,
      metadata = EXCLUDED.metadata
  `);
}

export async function processPostgresInboundRequest(payload: InboundPayload) {
  const existing = await listPostgresInboundCandidates(payload.clientId);
  const { candidate, duplicate } = ingestCandidate(payload, existing);
  await insertPostgresInboundCandidate(candidate);

  const receipt = createAutomationReceipt(
    duplicate
      ? {
          kind: "dedupe_skip",
          clientId: payload.clientId,
          summary: `Duplicate inbound skipped: ${payload.title}`,
          metadata: { dedupeKey: candidate.dedupeKey, source: payload.source },
        }
      : {
          kind: "inbound_capture",
          clientId: payload.clientId,
          summary: `Inbound captured: ${payload.title}`,
          metadata: { source: payload.source, candidateId: candidate.id },
        },
  );
  await insertPostgresReceipt(receipt);

  const candidates = await listPostgresInboundCandidates(payload.clientId);
  const receipts = await listPostgresReceipts();

  return {
    ok: true as const,
    candidate,
    duplicate,
    queueSize: listNewCandidates(candidates, payload.clientId).length,
    receipts,
  };
}
