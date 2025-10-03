@description('Azure region')
param location string = resourceGroup().location

@description('Container image for the frontend')
param frontendImage string = 'fortequizcontainerregistry.azurecr.io/quiz-frontend:latest'

@description('Container image for the backend')
param backendImage string = 'fortequizcontainerregistry.azurecr.io/quiz-backend:latest'

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

var containerAppName = 'quiz-frontend'
var environmentName = 'quiz-environment'
var containerRegistryName = 'fortequizcontainerregistry'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: 'forte-quiz-managed-identity'
}

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'law-quiz'
  location: location
  tags: {
    Environment: 'Production'
    Project: 'Quiz'
    ManagedBy: 'Bicep'
  }
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = {
  name: containerRegistryName
  location: location
  tags: {
    Environment: 'Production'
    Project: 'Quiz'
    ManagedBy: 'Bicep'
  }
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
  }
}

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: environmentName
  location: location
  tags: {
    Environment: 'Production'
    Project: 'Quiz'
    ManagedBy: 'Bicep'
  }
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

resource backendContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'quiz-backend'
  location: location
  registries:[
    {
      server: containerRegistry.properties.loginServer
      identity: managedIdentity.id
    }
  ]
  tags: {
    Environment: 'Production'
    Project: 'Quiz'
    ManagedBy: 'Bicep'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
       registries:[
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
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

resource frontendContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: containerAppName
  location: location
  tags: {
    Environment: 'Production'
    Project: 'Quiz'
    ManagedBy: 'Bicep'
  }

  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      registries:[
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
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
              value: 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
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

output frontendUrl string = 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'
output backendUrl string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output containerAppName string = frontendContainerApp.name
output environmentName string = containerAppEnvironment.name
output containerRegistryLoginServer string = containerRegistry.properties.loginServer
