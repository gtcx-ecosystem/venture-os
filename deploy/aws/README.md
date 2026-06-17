# AWS — venture-os

**Primary fleet path:** ECR → EKS via **fabric-os** staging overlay.

## Build + push (ECR)

```bash
export AWS_REGION=af-south-1
export ECR_REPO=348389439381.dkr.ecr.af-south-1.amazonaws.com/gtcx-venture-os
export PUSH=1
./deploy/scripts/build-push-ecr.sh
```

## Apply to staging (fabric-os)

Canonical overlay: `fabric-os/deploy/kubernetes/overlays/staging/venture-os/`

```bash
# fabric-os repo — after terraform apply module.secrets (venture-os.tf)
./platform/scripts/staging/populate-venture-os-staging-sm.sh
kubectl apply -k deploy/kubernetes/overlays/staging/venture-os/
kubectl get pods -n venture-os-staging
```

Secrets: AWS SM `gtcx/venture-os/staging/api-keys` → K8s `venture-os-secrets` (ESO).

Staging URL: `https://venture-staging.gtcx.trade`
