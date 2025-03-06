import { createAzure } from '@ai-sdk/azure';

export const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME || '', // Your Azure resource name
  apiKey: process.env.AZURE_OPENAI_API_KEY || '',
});
