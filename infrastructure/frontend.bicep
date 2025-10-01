@description('Azure region')
param location string = resourceGroup().location

@description('Container image for the frontend')
param frontendImage string = 'fortequizcontainerregistry.azurecr.io/quiz-frontend:latest'

@description('Container image for the backend')
param backendImage string = 'fortequizcontainerregistry.azurecr.io/quiz-backend:latest'

@description('API base URL for the frontend')
param apiBaseUrl string = 'https://your-backend-url.azurecontainerapps.io'

@description('Azure OpenAI endpoint')
param azureOpenAIEndpoint string

@description('Azure OpenAI API key')
@secure()
param azureOpenAIApiKey string

@description('Azure OpenAI deployment name')
param azureOpenAIDeploymentName string = 'gpt-4o-mini'

@description('SQL Server connection string')
@secure()
param sqlConnectionString string

// Variables
var containerAppName = 'quiz-frontend'
var environmentName = 'quiz-environment'
var managedIdentityName = 'quiz-managed-identity'

// User-Assigned Managed Identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
}

// Role assignment for ACR access
resource acrRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(managedIdentity.id, 'AcrPull')
  scope: subscriptionResourceId('Microsoft.ContainerRegistry/registries', 'fortequizcontainerregistry')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull role
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'law-quiz'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Container Apps Environment
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: environmentName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

// Frontend Container App
resource frontendContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    identity: {
      type: 'UserAssigned'
      userAssignedIdentities: {
        '${managedIdentity.id}': {}
      }
    }
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 443
        transport: 'http'
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
    }
    template: {
      containers: [
        {
          name: 'quiz-frontend'
          image: frontendImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'NEXT_PUBLIC_API_BASE_URL'
              value: apiBaseUrl
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

// Backend Container App
resource backendContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'quiz-backend'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    identity: {
      type: 'UserAssigned'
      userAssignedIdentities: {
        '${managedIdentity.id}': {}
      }
    }
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 80
        transport: 'http'
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
    }
    template: {
      containers: [
        {
          name: 'quiz-backend'
          image: backendImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: 'Production'
            }
            {
              name: 'ConnectionStrings__DefaultConnection'
              value: sqlConnectionString
            }
            {
              name: 'AzureOpenAI__Endpoint'
              value: azureOpenAIEndpoint
            }
            {
              name: 'AzureOpenAI__ApiKey'
              value: azureOpenAIApiKey
            }
            {
              name: 'AzureOpenAI__DeploymentName'
              value: azureOpenAIDeploymentName
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

// Outputs
output frontendUrl string = 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'
output backendUrl string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output containerAppName string = frontendContainerApp.name
output environmentName string = containerAppEnvironment.name
