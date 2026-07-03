-- Venture OS demo/staging data store.
-- Verified consuming paths:
-- - app/app/api/venture/opportunities/route.ts
-- - app/app/api/venture/inbound/route.ts
-- - app/app/api/venture/receipts/route.ts
-- - app/app/api/venture/workflow/queue/route.ts

CREATE TABLE IF NOT EXISTS venture_opportunities (
  id text PRIMARY KEY,
  client_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('capital', 'revenue', 'partner', 'visibility', 'collateral')),
  title text NOT NULL,
  headline text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL,
  horizon text NOT NULL,
  fit text NOT NULL,
  visual_class text NOT NULL,
  evidence_status text NOT NULL CHECK (evidence_status IN ('verified', 'needs_proof', 'blocked')),
  evidence_ref text,
  seeded_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS venture_opportunities_client_idx
  ON venture_opportunities (client_id, priority, kind);

CREATE INDEX IF NOT EXISTS venture_opportunities_evidence_idx
  ON venture_opportunities (evidence_status, client_id);

CREATE TABLE IF NOT EXISTS venture_inbound_candidates (
  id text NOT NULL,
  dedupe_key text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL CHECK (status IN ('new', 'duplicate')),
  client_id text NOT NULL,
  source text NOT NULL,
  title text NOT NULL,
  kind text CHECK (kind IN ('capital', 'revenue', 'partner', 'visibility', 'collateral')),
  urgency text CHECK (urgency IN ('P1', 'P2', 'P3')),
  external_id text,
  body text,
  payload jsonb NOT NULL,
  PRIMARY KEY (id, received_at)
) PARTITION BY RANGE (received_at);

CREATE TABLE IF NOT EXISTS venture_inbound_candidates_default
  PARTITION OF venture_inbound_candidates DEFAULT;

CREATE INDEX IF NOT EXISTS venture_inbound_candidates_received_brin
  ON venture_inbound_candidates USING brin (received_at);

CREATE INDEX IF NOT EXISTS venture_inbound_candidates_client_status_idx
  ON venture_inbound_candidates (client_id, status, received_at DESC);

CREATE INDEX IF NOT EXISTS venture_inbound_candidates_dedupe_idx
  ON venture_inbound_candidates (dedupe_key, status, received_at DESC);

CREATE TABLE IF NOT EXISTS venture_automation_receipts (
  id text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL,
  actor text NOT NULL,
  client_id text,
  summary text NOT NULL,
  metadata jsonb,
  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE ("timestamp");

CREATE TABLE IF NOT EXISTS venture_automation_receipts_default
  PARTITION OF venture_automation_receipts DEFAULT;

CREATE INDEX IF NOT EXISTS venture_automation_receipts_timestamp_brin
  ON venture_automation_receipts USING brin ("timestamp");

CREATE INDEX IF NOT EXISTS venture_automation_receipts_client_kind_idx
  ON venture_automation_receipts (client_id, kind, "timestamp" DESC);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_partman') THEN
    RAISE NOTICE 'pg_partman is available for future scheduled partition management; default partitions remain the guarded baseline for venture-os demo data.';
  ELSE
    RAISE NOTICE 'pg_partman is not available; venture-os is using native range partitions with default partitions and BRIN indexes.';
  END IF;
END
$$;

INSERT INTO venture_schema_migrations (id)
VALUES ('002_venture_demo_store')
ON CONFLICT (id) DO NOTHING;
