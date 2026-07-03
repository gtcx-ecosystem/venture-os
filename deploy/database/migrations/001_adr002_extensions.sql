-- Venture OS ADR-002 alignment: optional Postgres extensions.
-- These are guarded because local/demo environments may not have the RDS
-- extension binaries installed. Missing binaries must be visible but must not
-- block the offline repo assurance chain.

CREATE TABLE IF NOT EXISTS venture_schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS vector;
  RAISE NOTICE 'ADR-002 optional extension enabled: vector';
EXCEPTION
  WHEN undefined_file OR insufficient_privilege OR feature_not_supported THEN
    RAISE NOTICE 'ADR-002 optional extension unavailable: vector. Continuing without vector columns because venture-os has no embedding consumer path yet. %', SQLERRM;
END
$$;

DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  RAISE NOTICE 'ADR-002 optional extension enabled: pg_cron';
EXCEPTION
  WHEN undefined_file OR insufficient_privilege OR feature_not_supported OR object_not_in_prerequisite_state THEN
    RAISE NOTICE 'ADR-002 optional extension unavailable: pg_cron. Native partitions and BRIN indexes remain usable. %', SQLERRM;
END
$$;

DO $$
BEGIN
  CREATE SCHEMA IF NOT EXISTS partman;
  CREATE EXTENSION IF NOT EXISTS pg_partman WITH SCHEMA partman;
  RAISE NOTICE 'ADR-002 optional extension enabled: pg_partman';
EXCEPTION
  WHEN undefined_file OR insufficient_privilege OR feature_not_supported THEN
    RAISE NOTICE 'ADR-002 optional extension unavailable: pg_partman. Manual/default partitions remain active. %', SQLERRM;
END
$$;

INSERT INTO venture_schema_migrations (id)
VALUES ('001_adr002_extensions')
ON CONFLICT (id) DO NOTHING;
