# Auto-dev state — venture-os

**Updated:** 2026-06-17

## Next work (computed)

| Field | Value |
| ----- | ----- |
| **Story** | DEPLOY-02 |
| **Action** | First staging deploy — AWS ECR+EKS or GCP Cloud Run |
| **Owner** | venture-os / fabric-os |
| **Because** | Fleet uses AWS + GCP; container + probes wired |

## Verify

```bash
pnpm test && pnpm build
docker build -f deploy/docker/Dockerfile -t gtcx-venture-os:local .
```
