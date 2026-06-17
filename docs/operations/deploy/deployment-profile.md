# Deployment profile — venture-os

**App:** Next.js 16 in [`app/`](../../app/)  
**Fleet hosts:** **AWS** (ECR → EKS via fabric-os) · **GCP** (Cloud Run / Artifact Registry)  
**Not used:** Vercel (account suspended; fleet standard is AWS/GCP)

## Build

```bash
pnpm install
pnpm test && pnpm build && pnpm ops:check
```

## AWS — ECR + EKS (primary)

| Step | Command / artifact |
| ---- | ------------------ |
| Image | [`deploy/docker/Dockerfile`](../../deploy/docker/Dockerfile) |
| Build/push | [`deploy/scripts/build-push-ecr.sh`](../../deploy/scripts/build-push-ecr.sh) |
| K8s overlay (SoR) | `fabric-os/deploy/kubernetes/overlays/staging/venture-os/` |
| Terraform IRSA | `fabric-os/deploy/terraform/modules/secrets/venture-os.tf` |
| SM populate | `fabric-os/platform/scripts/staging/populate-venture-os-staging-sm.sh` |
| ECR (staging) | `348389439381.dkr.ecr.af-south-1.amazonaws.com/gtcx-venture-os` |
| Staging URL | `https://venture-staging.gtcx.trade` |

```bash
export AWS_REGION=af-south-1
export ECR_REPO=348389439381.dkr.ecr.af-south-1.amazonaws.com/gtcx-venture-os
export PUSH=1
./deploy/scripts/build-push-ecr.sh
```

Secrets: AWS SM path `gtcx/venture-os/staging/api-keys` → K8s `venture-os-secrets` via ESO (mirror terminal-os).

```bash
# fabric-os — after terraform apply
kubectl apply -k deploy/kubernetes/overlays/staging/venture-os/
```

## GCP — Cloud Run

| Step | Command / artifact |
| ---- | ------------------ |
| Deploy script | [`deploy/scripts/deploy-cloud-run.sh`](../../deploy/scripts/deploy-cloud-run.sh) |
| Runbook | [`deploy/gcp/README.md`](../../deploy/gcp/README.md) |

```bash
export GCP_PROJECT=your-gcp-project
export GCP_REGION=africa-south1
./deploy/scripts/deploy-cloud-run.sh
```

## Probes

| Path | Use |
| ---- | --- |
| `/api/health` | Liveness (EKS + Cloud Run) |
| `/api/ready` | Readiness |

## Environment variables

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `VENTURE_WEBHOOK_SECRET` | recommended | API route auth |
| `CLICKUP_API_TOKEN` | optional | Live ClickUp sync |
| `CLICKUP_LIST_ID` | optional | Venture Opportunities list |
| `LISTMONK_URL` | optional | Newsletter live send |
| `DEPLOY_ENV` | optional | `staging` / `production` in health payload |

## Smoke after deploy

```bash
curl -sSf "$DEPLOY_URL/api/health"
curl -sSf "$DEPLOY_URL/api/venture/opportunities?clientId=terra_os"
```

## Witness

Record URL in [`audit/evidence/deployment-proof-latest.json`](../../audit/evidence/deployment-proof-latest.json) after first green deploy on AWS or GCP.
