# AWS — venture-os

**Primary fleet path:** ECR → EKS (fabric-os staging overlays).

## Build + push (ECR)

```bash
export AWS_REGION=af-south-1
export ECR_REPO=348389439381.dkr.ecr.af-south-1.amazonaws.com/gtcx-venture-os
export PUSH=1
./deploy/scripts/build-push-ecr.sh
```

## Apply to staging

Register overlay in `fabric-os/deploy/kubernetes/overlays/staging/venture-os/` using [`kubernetes/staging/deployment.yaml`](../kubernetes/staging/deployment.yaml).

```bash
kubectl apply -k fabric-os/deploy/kubernetes/overlays/staging/venture-os
```

Secrets: AWS Secrets Manager via ExternalSecrets — `venture-os-secrets` (see terminal-os pattern).
