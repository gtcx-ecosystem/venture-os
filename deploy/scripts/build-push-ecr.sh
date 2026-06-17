#!/usr/bin/env bash
# Build and optionally push venture-os image to AWS ECR.
# Usage:
#   AWS_REGION=af-south-1 ECR_REPO=348389439381.dkr.ecr.af-south-1.amazonaws.com/gtcx-venture-os ./deploy/scripts/build-push-ecr.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo local)}"
ECR_REPO="${ECR_REPO:?Set ECR_REPO}"
AWS_REGION="${AWS_REGION:-af-south-1}"
LOCAL_TAG="gtcx-venture-os:${IMAGE_TAG}"

echo "Building ${LOCAL_TAG}..."
docker build -f deploy/docker/Dockerfile -t "${LOCAL_TAG}" .

if [[ "${PUSH:-0}" == "1" ]]; then
  aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REPO%%/*}"
  docker tag "${LOCAL_TAG}" "${ECR_REPO}:${IMAGE_TAG}"
  docker tag "${LOCAL_TAG}" "${ECR_REPO}:latest"
  docker push "${ECR_REPO}:${IMAGE_TAG}"
  docker push "${ECR_REPO}:latest"
  echo "Pushed ${ECR_REPO}:${IMAGE_TAG}"
fi
