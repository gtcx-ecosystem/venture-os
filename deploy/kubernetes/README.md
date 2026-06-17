# Kubernetes — venture-os

Staging manifest reference for **fabric-os** EKS overlays.

| Path | Purpose |
| ---- | ------- |
| [`staging/deployment.yaml`](./staging/deployment.yaml) | Deployment + Service (port 3000) |
| fabric-os overlay | Copy or symlink into `fabric-os/deploy/kubernetes/overlays/staging/venture-os/` |

Probes: `/api/health` (liveness) · `/api/ready` (readiness)

Build image: [`../scripts/build-push-ecr.sh`](../scripts/build-push-ecr.sh)
