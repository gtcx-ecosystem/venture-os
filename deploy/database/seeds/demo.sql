-- Synthetic demo-grade data for Venture OS. Do not present these rows as
-- production data. The seed runner refuses NODE_ENV=production.

DO $$
DECLARE
  missing_column text;
BEGIN
  WITH required(table_name, column_name) AS (
    VALUES
      ('venture_opportunities', 'id'),
      ('venture_opportunities', 'client_id'),
      ('venture_opportunities', 'kind'),
      ('venture_opportunities', 'headline'),
      ('venture_opportunities', 'evidence_status'),
      ('venture_inbound_candidates', 'dedupe_key'),
      ('venture_inbound_candidates', 'received_at'),
      ('venture_inbound_candidates', 'payload'),
      ('venture_automation_receipts', 'kind'),
      ('venture_automation_receipts', 'timestamp'),
      ('venture_automation_receipts', 'metadata')
  )
  SELECT required.table_name || '.' || required.column_name
  INTO missing_column
  FROM required
  LEFT JOIN information_schema.columns c
    ON c.table_schema = 'public'
   AND c.table_name = required.table_name
   AND c.column_name = required.column_name
  WHERE c.column_name IS NULL
  LIMIT 1;

  IF missing_column IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot seed Venture OS demo data; missing verified migration column: %', missing_column;
  END IF;
END
$$;

INSERT INTO venture_opportunities (
  id, client_id, kind, title, headline, description, priority, horizon, fit,
  visual_class, evidence_status, evidence_ref
) VALUES
  (
    'afdb-dpi',
    'terra_os',
    'capital',
    'afdb digital public infrastructure window terraos',
    'AfDB DPI + land-rights pilot',
    'Route TerraOS into sovereign/DFI pilot conversation with bankability proof.',
    'P1',
    '14d',
    '92 fit',
    'visual-land',
    'needs_proof',
    'docs/foundation/milestones.md#m4-golden-transaction'
  ),
  (
    'terra-bank-insurer',
    'terra_os',
    'partner',
    'terraos bank insurer land credit score partnership',
    'Bank + insurer partnership loop',
    'Structure a bank/insurer co-pilot around land credit score + claims evidence reuse.',
    'P2',
    '30d',
    '83 fit',
    'visual-channel',
    'needs_proof',
    'pm/product/prds/prd-land-credit-score.md'
  ),
  (
    'markets-pilot',
    'markets_os',
    'revenue',
    'markets os buyer refiner trader pilot',
    'Buyer/refiner paid pilot',
    'Convert Markets OS proof into a short commercial pilot with clear deal economics.',
    'P1',
    '9d',
    '88 fit',
    'visual-market',
    'verified',
    'audit/evidence/golden-transaction-markets-staging-2026-06-12.json'
  ),
  (
    'fifty-four-press',
    'terminal_os',
    'visibility',
    'fifty four griot african commodity intelligence press',
    'Africa commodity intelligence launch',
    'Turn FIFTY-FOUR + Griot into press, LinkedIn, and executive audience growth.',
    'P1',
    '5d',
    '90 fit',
    'visual-media',
    'needs_proof',
    'docs/product/ux/visibility-desk.md'
  ),
  (
    'compliance-standards-body',
    'compliance_os',
    'partner',
    'compliance os standards body auditor partnership',
    'Auditor + standards body partners',
    'Open an auditor/standards partnership lane to validate Core12 evidence reuse and scoring.',
    'P2',
    '24d',
    '80 fit',
    'visual-channel',
    'blocked',
    'docs/compliance/standards-body-partnership.md'
  )
ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  kind = EXCLUDED.kind,
  title = EXCLUDED.title,
  headline = EXCLUDED.headline,
  description = EXCLUDED.description,
  priority = EXCLUDED.priority,
  horizon = EXCLUDED.horizon,
  fit = EXCLUDED.fit,
  visual_class = EXCLUDED.visual_class,
  evidence_status = EXCLUDED.evidence_status,
  evidence_ref = EXCLUDED.evidence_ref,
  updated_at = now();

INSERT INTO venture_inbound_candidates (
  id, dedupe_key, received_at, status, client_id, source, title, kind, urgency,
  external_id, body, payload
) VALUES
  (
    'seed-inbound-terra-dfi',
    'terra_os:gmail:dfi-program-window-2026',
    '2026-07-03T08:00:00Z',
    'new',
    'terra_os',
    'gmail',
    'DFI land-rights pilot window opened',
    'capital',
    'P1',
    'dfi-program-window-2026',
    'Synthetic demo inbound from a DFI programme officer asking for bankability proof.',
    '{"source":"gmail","title":"DFI land-rights pilot window opened","clientId":"terra_os","kind":"capital","urgency":"P1","externalId":"dfi-program-window-2026","body":"Synthetic demo inbound from a DFI programme officer asking for bankability proof."}'::jsonb
  ),
  (
    'seed-inbound-terminal-griot',
    'terminal_os:griot:griot-corridor-brief-2026',
    '2026-07-03T09:00:00Z',
    'new',
    'terminal_os',
    'griot',
    'Griot corridor signal needs visibility desk review',
    'visibility',
    'P1',
    'griot-corridor-brief-2026',
    'Synthetic demo signal from the Griot adapter for the FIFTY-FOUR launch.',
    '{"source":"griot","title":"Griot corridor signal needs visibility desk review","clientId":"terminal_os","kind":"visibility","urgency":"P1","externalId":"griot-corridor-brief-2026","body":"Synthetic demo signal from the Griot adapter for the FIFTY-FOUR launch."}'::jsonb
  )
ON CONFLICT (id, received_at) DO UPDATE SET
  status = EXCLUDED.status,
  payload = EXCLUDED.payload,
  body = EXCLUDED.body;

INSERT INTO venture_automation_receipts (
  id, timestamp, kind, actor, client_id, summary, metadata
) VALUES
  (
    'seed-receipt-terra-dfi',
    '2026-07-03T08:01:00Z',
    'inbound_capture',
    'system',
    'terra_os',
    'Inbound captured: DFI land-rights pilot window opened',
    '{"source":"gmail","candidateId":"seed-inbound-terra-dfi","synthetic":true}'::jsonb
  ),
  (
    'seed-receipt-terminal-griot',
    '2026-07-03T09:01:00Z',
    'inbound_capture',
    'system',
    'terminal_os',
    'Inbound captured: Griot corridor signal needs visibility desk review',
    '{"source":"griot","candidateId":"seed-inbound-terminal-griot","synthetic":true}'::jsonb
  ),
  (
    'seed-receipt-claims-withheld',
    '2026-07-03T09:05:00Z',
    'workflow_queued',
    'operator',
    'terra_os',
    'Workflow queued with claims review before external publish',
    '{"evidenceRef":"docs/foundation/milestones.md#m4-golden-transaction","synthetic":true}'::jsonb
  )
ON CONFLICT (id, timestamp) DO UPDATE SET
  kind = EXCLUDED.kind,
  summary = EXCLUDED.summary,
  metadata = EXCLUDED.metadata;
