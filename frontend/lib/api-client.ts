// Use the generated client and types
import { QuizService, QuestionDto, OpenAPI } from './generated/client';

// Configure the base URL
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  /**
   * Get recent questions by category using the generated client
   */
  async getRecentQuestionsByCategory(
    category: string,
    count: number = 10
  ): Promise<ApiResponse<QuestionDto[]>> {
    try {
      const data = await QuizService.getApiQuizRecent(category, count);
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export { ApiClient };

// Export types from generated client
export type { QuestionDto }; 