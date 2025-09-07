// Use the generated client and types
import { 
  QuizService, 
  ScoreService, 
  UserService,
  QuestionDto,
  QuizAttemptDto,
  LeaderboardEntryDto,
  SubmitQuizWithUserDto,
  UserDto,
  UserScoreDto,
  DailyLeaderboardDto,
  AllTimePodiumStatsDto
} from './generated/client';
import './api-config'; // Import to configure the API client

// Configure the base URL
// OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface QuizSessionDto {
  id: string;
  category: string;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
}

export interface ExtendedLeaderboardEntryDto extends LeaderboardEntryDto {
  rank?: number;
  timeSpentSeconds?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000';
  }

  // Quiz methods
  async getRecentQuestionsByCategory(
    category: string,
    count: number = 10
  ): Promise<ApiResponse<QuestionDto[]>> {
    try {
      const questions = await QuizService.getApiQuizRecent(category, count);
      return { data: questions };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch questions' };
    }
  }

  async getDailyGenerationStatus(category: string): Promise<ApiResponse<{ isGenerated: boolean; questionsGenerated: number }>> {
    try {
      const status = await QuizService.getApiQuizRecent(category);
      return { data: { isGenerated: true, questionsGenerated: status.length } };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch daily status' };
    }
  }

  // User methods
  async syncUser(userData: { gitHubId: string; email: string; name: string; avatarUrl: string }): Promise<ApiResponse<UserDto>> {
    try {
      const user = await UserService.postApiUserSync({
        gitHubId: userData.gitHubId,
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl
      });
      return { data: user };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to sync user' };
    }
  }

  async getUserByGitHubId(gitHubId: string): Promise<ApiResponse<UserDto>> {
    try {
      const user = await UserService.getApiUser(gitHubId);
      return { data: user };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch user' };
    }
  }

  async getUserScores(userId: string): Promise<ApiResponse<UserScoreDto[]>> {
    try {
      const scores = await UserService.getApiUserScores(userId);
      return { data: scores };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch user scores' };
    }
  }

  async getUserQuizSessions(userId: string, category?: string): Promise<ApiResponse<QuizSessionDto[]>> {
    try {
      const sessions = await UserService.getApiUserQuizSessions(userId, category);
      return { data: sessions as QuizSessionDto[] };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch user quiz sessions' };
    }
  }

  // Score methods
  async submitQuizResult(submitDto: SubmitQuizWithUserDto): Promise<ApiResponse<{ message: string }>> {
    try {
      await ScoreService.postApiScoreSubmit(submitDto);
      return { data: { message: 'Quiz result submitted successfully' } };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to submit quiz result' };
    }
  }

  // Leaderboard methods
  async getLeaderboard(category: string, limit: number = 10): Promise<ApiResponse<LeaderboardEntryDto[]>> {
    try {
      const leaderboard = await ScoreService.getApiScoreLeaderboard(category, limit);
      return { data: leaderboard };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch leaderboard' };
    }
  }

  async getDailyLeaderboard(category: string, date?: string, limit: number = 10): Promise<ApiResponse<LeaderboardEntryDto[]>> {
    try {
      const leaderboard = await ScoreService.getApiScoreLeaderboardDaily(category, date, limit);
      return { data: leaderboard };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch daily leaderboard' };
    }
  }

  async getHistoricalLeaderboards(category: string, days: number = 7): Promise<ApiResponse<DailyLeaderboardDto[]>> {
    try {
      const historicalLeaderboards = await ScoreService.getApiScoreLeaderboardHistorical(category, days);
      return { data: historicalLeaderboards };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch historical leaderboards' };
    }
  }

  async getAllTimePodiumStats(category: string, limit: number = 10): Promise<ApiResponse<AllTimePodiumStatsDto[]>> {
    try {
      const podiumStats = await ScoreService.getApiScorePodiumStats(category, limit);
      return { data: podiumStats };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch podium stats' };
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
  SubmitQuizWithUserDto,
  LeaderboardEntryDto,
  DailyLeaderboardDto,
  AllTimePodiumStatsDto
}; 