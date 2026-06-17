# deploy — venture-os

Fleet deploy surface — **AWS EKS** + **GCP Cloud Run** (not Vercel).

| Path | Purpose |
| ---- | ------- |
| [`docker/Dockerfile`](./docker/Dockerfile) | Production Next.js standalone image |
| [`scripts/build-push-ecr.sh`](./scripts/build-push-ecr.sh) | AWS ECR build + push |
| [`scripts/deploy-cloud-run.sh`](./scripts/deploy-cloud-run.sh) | GCP Cloud Run deploy |
| [`kubernetes/README.md`](./kubernetes/README.md) | Points to fabric-os EKS overlay (SoR) |
| [`aws/README.md`](./aws/README.md) | AWS runbook |
| [`gcp/README.md`](./gcp/README.md) | GCP runbook |
| [`../docs/operations/deploy/deployment-profile.md`](../docs/operations/deploy/deployment-profile.md) | Canonical profile |

**Live URL:** pending first ECR push + fabric-os overlay apply, or Cloud Run deploy.
