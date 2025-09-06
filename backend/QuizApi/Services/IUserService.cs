using QuizApi.Models;

namespace QuizApi.Services;

public interface IUserService
{
    Task<User> GetOrCreateUserAsync(string gitHubId, string email, string name, string avatarUrl);
    Task<User?> GetUserByGitHubIdAsync(string gitHubId);
    Task UpdateLastLoginAsync(Guid userId);
    Task<List<UserScore>> GetUserScoresAsync(Guid userId);
    Task<UserScore?> GetUserScoreAsync(Guid userId, string category);
    Task<List<UserScore>> GetLeaderboardAsync(string category, int limit = 10);
} 