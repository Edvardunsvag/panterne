import { OpenAPI } from './generated/client/core/OpenAPI';

// Configure the OpenAPI client to point to the backend API server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export const configureApiClient = () => {
  OpenAPI.BASE = API_BASE_URL;
  OpenAPI.WITH_CREDENTIALS = false;
  OpenAPI.CREDENTIALS = 'include';
};

// Initialize the configuration
configureApiClient(); 