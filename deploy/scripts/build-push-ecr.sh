#!/usr/bin/env bash
# Build and optionally push venture-os image to AWS ECR (linux/amd64 for EKS).
# Usage:
#   AWS_REGION=af-south-1 ECR_REPO=348389439381.dkr.ecr.af-south-1.amazonaws.com/gtcx-venture-os PUSH=1 ./deploy/scripts/build-push-ecr.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo local)}"
ECR_REPO="${ECR_REPO:?Set ECR_REPO}"
AWS_REGION="${AWS_REGION:-af-south-1}"
LOCAL_TAG="gtcx-venture-os:${IMAGE_TAG}"

echo "Building ${LOCAL_TAG} (linux/amd64)..."
if [[ "${PUSH:-0}" == "1" ]]; then
  aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REPO%%/*}"
  docker buildx build --platform linux/amd64 \
    -f deploy/docker/Dockerfile \
    -t "${ECR_REPO}:${IMAGE_TAG}" \
    -t "${ECR_REPO}:latest" \
    --push .
  echo "Pushed ${ECR_REPO}:${IMAGE_TAG} and :latest"
else
  docker buildx build --platform linux/amd64 \
    -f deploy/docker/Dockerfile \
    -t "${LOCAL_TAG}" \
    --load .
  echo "Built ${LOCAL_TAG} (local load only; set PUSH=1 to push)"
fi
