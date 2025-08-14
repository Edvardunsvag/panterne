// Use the generated client and types
import { 
  QuizService, 
  UserService, 
  ScoreService,
  QuestionDto, 
  UserDto,
  UserScoreDto,
  QuizAttemptDto,
  SubmitQuizResultDto,
  SubmitQuizWithUserDto,
  SyncUserDto,
  LeaderboardEntryDto,
  OpenAPI 
} from './generated/client';

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

  /**
   * Sync user with backend (create or update)
   */
  async syncUser(syncUserDto: SyncUserDto): Promise<ApiResponse<UserDto>> {
    try {
      const data = await UserService.postApiUserSync(syncUserDto);
      return { data };
    } catch (error) {
      console.error('Sync user failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to sync user'
      };
    }
  }

  /**
   * Get user by GitHub ID
   */
  async getUserByGitHubId(gitHubId: string): Promise<ApiResponse<UserDto>> {
    try {
      const data = await UserService.getApiUser(gitHubId);
      return { data };
    } catch (error) {
      console.error('Get user failed:', error);
      if (error instanceof Error && error.message.includes('404')) {
        return { error: 'User not found' };
      }
      return {
        error: error instanceof Error ? error.message : 'Failed to get user'
      };
    }
  }

  /**
   * Get user scores
   */
  async getUserScores(userId: string): Promise<ApiResponse<UserScoreDto[]>> {
    try {
      const data = await UserService.getApiUserScores(userId);
      return { data };
    } catch (error) {
      console.error('Get user scores failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to get user scores'
      };
    }
  }

  /**
   * Submit quiz result using the generated client
   */
  async submitQuizResult(submitDto: SubmitQuizWithUserDto): Promise<ApiResponse<{ message: string }>> {
    try {
      console.log('Submitting quiz result:', JSON.stringify(submitDto, null, 2));
      
      const data = await ScoreService.postApiScoreSubmit(submitDto);
      return { data };
    } catch (error) {
      console.error('Submit quiz result failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to submit quiz result'
      };
    }
  }

  /**
   * Get leaderboard for category
   */
  async getLeaderboard(category: string, limit: number = 10): Promise<ApiResponse<LeaderboardEntryDto[]>> {
    try {
      const data = await ScoreService.getApiScoreLeaderboard(category, limit);
      return { data };
    } catch (error) {
      console.error('Get leaderboard failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to get leaderboard'
      };
    }
  }
}

export const apiClient = new ApiClient();

// Re-export all the generated types for convenience
export type { 
  QuestionDto,
  UserDto,
  UserScoreDto,
  QuizAttemptDto,
  SubmitQuizResultDto,
  SubmitQuizWithUserDto,
  SyncUserDto,
  LeaderboardEntryDto
}; 