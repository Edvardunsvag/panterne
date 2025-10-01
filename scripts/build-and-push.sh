#!/bin/bash

# Build and push frontend Docker image to your container registry
set -e

RESOURCE_GROUP="forte-quiz-edvard"
CONTAINER_REGISTRY="fortequizcontainerregistry.azurecr.io"
IMAGE_TAG=${1:-"latest"}

echo "🐳 Building and pushing frontend Docker image"
echo "📦 Container Registry: ${CONTAINER_REGISTRY}"
echo "🏷️  Image Tag: ${IMAGE_TAG}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo "🔐 Please log in to Azure CLI"
    az login
fi

# Login to container registry
echo "🔐 Logging in to container registry..."
az acr login --name "fortequizcontainerregistry"

# Build and push frontend
echo "🎨 Building frontend image..."
cd frontend
docker build -f Dockerfile.prod -t "${CONTAINER_REGISTRY}/quiz-frontend:${IMAGE_TAG}" .
docker push "${CONTAINER_REGISTRY}/quiz-frontend:${IMAGE_TAG}"

echo "✅ Frontend image built and pushed successfully!"
echo "🐳 Image: ${CONTAINER_REGISTRY}/quiz-frontend:${IMAGE_TAG}"

# Update container app
echo "🔄 Updating container app..."
az containerapp update \
  --name "quiz-frontend" \
  --resource-group "${RESOURCE_GROUP}" \
  --image "${CONTAINER_REGISTRY}/quiz-frontend:${IMAGE_TAG}"

echo "✅ Container app updated successfully!"
