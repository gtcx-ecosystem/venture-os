# Kubernetes — venture-os

**Canonical SoR:** `fabric-os/deploy/kubernetes/overlays/staging/venture-os/`

Do not apply manifests from this repo. The overlay in **fabric-os** is the fleet source of truth (namespace, IRSA, ESO, deployment, service, ingress).

| Step | Owner | Command / path |
| ---- | ----- | -------------- |
| Build/push image | venture-os | [`../scripts/build-push-ecr.sh`](../scripts/build-push-ecr.sh) |
| Terraform IRSA + SM shell | fabric-os | `deploy/terraform/modules/secrets/venture-os.tf` |
| Populate SM values | fabric-os | `platform/scripts/staging/populate-venture-os-staging-sm.sh` |
| Apply overlay | fabric-os | `kubectl apply -k deploy/kubernetes/overlays/staging/venture-os/` |

Probes: `/api/health` (liveness) · `/api/ready` (readiness)

Staging URL (after apply): `https://venture-staging.gtcx.trade`

See [`../../docs/operations/deploy/deployment-profile.md`](../../docs/operations/deploy/deployment-profile.md).
