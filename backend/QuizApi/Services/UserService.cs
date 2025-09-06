using Microsoft.EntityFrameworkCore;
using QuizApi.Data;
using QuizApi.Models;

namespace QuizApi.Services;

public class UserService : IUserService
{
    private readonly QuizDbContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(QuizDbContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<User> GetOrCreateUserAsync(string gitHubId, string email, string name, string avatarUrl)
    {
        // First, try to find by GitHubId
        var user = await _context.Users.FirstOrDefaultAsync(u => u.GitHubId == gitHubId);
        
        // If not found by GitHubId, try to find by email
        if (user == null)
        {
            user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            // If found by email, update the GitHubId
            if (user != null)
            {
                user.GitHubId = gitHubId;
                user.Name = name;
                user.AvatarUrl = avatarUrl;
                user.LastLoginAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                _logger.LogInformation("Updated existing user with GitHub ID: {GitHubId}", gitHubId);
                return user;
            }
        }
        
        if (user == null)
        {
            // Create new user only if neither GitHubId nor email exists
            user = new User
            {
                Id = Guid.NewGuid(),
                GitHubId = gitHubId,
                Email = email,
                Name = name,
                AvatarUrl = avatarUrl,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Created new user with GitHub ID: {GitHubId}", gitHubId);
        }
        else
        {
            // Update user info in case it changed
            user.Email = email;
            user.Name = name;
            user.AvatarUrl = avatarUrl;
            user.LastLoginAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }

        return user;
    }

    public async Task<User?> GetUserByGitHubIdAsync(string gitHubId)
    {
        return await _context.Users
            .Include(u => u.UserScores)
            .FirstOrDefaultAsync(u => u.GitHubId == gitHubId);
    }

    public async Task UpdateLastLoginAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<UserScore>> GetUserScoresAsync(Guid userId)
    {
        return await _context.UserScores
            .Where(us => us.UserId == userId)
            .OrderByDescending(us => us.TotalScore)
            .ToListAsync();
    }

    public async Task<UserScore?> GetUserScoreAsync(Guid userId, string category)
    {
        return await _context.UserScores
            .FirstOrDefaultAsync(us => us.UserId == userId && us.Category == category);
    }

    public async Task<List<UserScore>> GetLeaderboardAsync(string category, int limit = 10)
    {
        return await _context.UserScores
            .Include(us => us.User)
            .Where(us => us.Category == category)
            .OrderByDescending(us => us.TotalScore)
            .ThenByDescending(us => us.AccuracyPercentage)
            .Take(limit)
            .ToListAsync();
    }
} 