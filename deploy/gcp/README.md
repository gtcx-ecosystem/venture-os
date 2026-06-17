# GCP — venture-os

**Primary serverless path:** Cloud Run (africa-south1 or fleet default region).

## Deploy

```bash
export GCP_PROJECT=your-project
export GCP_REGION=africa-south1
./deploy/scripts/deploy-cloud-run.sh
```

## Artifact Registry (alternative to --source)

```bash
gcloud builds submit --tag "${REGION}-docker.pkg.dev/${GCP_PROJECT}/gtcx/venture-os:$(git rev-parse --short HEAD)" \
  --dockerfile deploy/docker/Dockerfile .
gcloud run deploy venture-os-staging --image ...
```

Secrets: mount `VENTURE_WEBHOOK_SECRET`, `CLICKUP_*`, `LISTMONK_*` via Cloud Run secret env refs.
