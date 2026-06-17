#!/usr/bin/env bash
# Deploy venture-os to GCP Cloud Run (source build).
# Usage:
#   GCP_PROJECT=gtcx-pilot GCP_REGION=africa-south1 ./deploy/scripts/deploy-cloud-run.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

PROJECT="${GCP_PROJECT:?Set GCP_PROJECT}"
REGION="${GCP_REGION:-africa-south1}"
SERVICE="${CLOUD_RUN_SERVICE:-venture-os-staging}"
IMAGE="${ARTIFACT_IMAGE:-${REGION}-docker.pkg.dev/${PROJECT}/gtcx/venture-os}"

gcloud run deploy "${SERVICE}" \
  --project "${PROJECT}" \
  --region "${REGION}" \
  --source . \
  --dockerfile deploy/docker/Dockerfile \
  --port 3000 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
  --min-instances 0 \
  --max-instances 3 \
  --memory 512Mi \
  --cpu 1

echo "Deployed ${SERVICE} in ${PROJECT}/${REGION}"
