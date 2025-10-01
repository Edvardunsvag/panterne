#!/bin/bash

# Simple script to deploy frontend to Azure Container Apps
set -e

RESOURCE_GROUP="forte-quiz-edvard"
FRONTEND_IMAGE=${1:-"fortequizcontainerregistry.azurecr.io/quiz-frontend:latest"}
API_BASE_URL=${2:-"https://your-backend-url.azurecontainerapps.io"}

echo "🚀 Deploying Frontend to Azure Container Apps (Production)"
echo "📦 Resource Group: ${RESOURCE_GROUP}"
echo "🐳 Container Image: ${FRONTEND_IMAGE}"

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

# Check if resource group exists
if ! az group show --name "${RESOURCE_GROUP}" &> /dev/null; then
    echo "📦 Creating resource group..."
    az group create \
      --name "${RESOURCE_GROUP}" \
      --location "West Europe" \
      --output table
else
    echo "✅ Resource group '${RESOURCE_GROUP}' already exists"
fi

# Deploy the Bicep template
echo "🏗️  Deploying frontend container app..."
DEPLOYMENT_NAME="frontend-deployment-$(date +%Y%m%d-%H%M%S)"

az deployment group create \
  --resource-group "${RESOURCE_GROUP}" \
  --template-file "infrastructure/frontend.bicep" \
  --parameters "infrastructure/parameters.json" \
  --parameters frontendImage="${FRONTEND_IMAGE}" \
  --parameters apiBaseUrl="${API_BASE_URL}" \
  --name "${DEPLOYMENT_NAME}" \
  --output table

# Get the frontend URL
FRONTEND_URL=$(az deployment group show \
  --resource-group "${RESOURCE_GROUP}" \
  --name "${DEPLOYMENT_NAME}" \
  --query "properties.outputs.frontendUrl.value" \
  --output tsv)

echo "✅ Frontend deployed successfully!"
echo "🌐 Frontend URL: ${FRONTEND_URL}"
echo ""
echo "📝 Next steps:"
echo "1. Build and push your Docker image to fortequizcontainerregistry.azurecr.io"
echo "2. Update the container app with the new image"
echo "3. Test the deployed application"
