// API client for external QuizController backend

export interface QuestionDto {
  question: string;
  options: string[];
  correctAnswer: string;
  source: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Default to localhost for development, can be overridden via environment variable
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get recent questions by category from the QuizController
   */
  async getRecentQuestionsByCategory(
    category: string,
    count: number = 10
  ): Promise<ApiResponse<QuestionDto[]>> {
    return this.makeRequest<QuestionDto[]>(
      `/api/Quiz/recent/${category}?count=${count}`
    );
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export { ApiClient }; 