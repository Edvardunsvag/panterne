using QuizApi.Dtos;
using QuizApi.Models;

namespace QuizApi.Services;

public interface IQuizScoreService
{
    Task<QuizSession> CreateQuizSessionAsync(Guid userId, string category);
    Task<QuizAttempt> SubmitQuizAttemptAsync(Guid userId, Guid quizSessionId, QuizAttemptDto attemptDto);
    Task<QuizSession> SubmitQuizResultAsync(Guid userId, SubmitQuizResultDto resultDto);
    Task UpdateUserScoresAsync(Guid userId, string category);
    Task<List<QuizSessionDto>> GetUserQuizSessionsAsync(Guid userId, string? category = null);
    Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(string category, int limit = 10);
    Task<List<LeaderboardEntryDto>> GetDailyLeaderboardAsync(string category, DateTime date, int limit = 10);
    Task<List<DailyLeaderboardDto>> GetHistoricalLeaderboardsAsync(string category, int days = 7);
    Task<List<AllTimePodiumStatsDto>> GetAllTimePodiumStatsAsync(string category, int limit = 10);
    Task ProcessDailyLeaderboardAsync(string category, DateTime date);
    Task<List<UserScore>> GetUserScoresAsync(Guid userId);
} 