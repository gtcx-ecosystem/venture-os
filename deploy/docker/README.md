# Docker — venture-os

Production image: [`Dockerfile`](./Dockerfile)

```bash
# From repo root (Docker daemon required)
docker build -f deploy/docker/Dockerfile -t gtcx-venture-os:local .
docker run --rm -p 3000:3000 gtcx-venture-os:local
curl -s http://localhost:3000/api/health
```

Push to ECR: [`../scripts/build-push-ecr.sh`](../scripts/build-push-ecr.sh)
