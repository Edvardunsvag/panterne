using Microsoft.EntityFrameworkCore;
using QuizApi.Data;
using QuizApi.Dtos;
using QuizApi.Models;

namespace QuizApi.Services;

public class QuizScoreService : IQuizScoreService
{
    private readonly QuizDbContext _context;
    private readonly ILogger<QuizScoreService> _logger;

    public QuizScoreService(QuizDbContext context, ILogger<QuizScoreService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<QuizSession> CreateQuizSessionAsync(Guid userId, string category)
    {
        var quizSession = new QuizSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Category = category,
            StartedAt = DateTime.UtcNow,
            Date = DateTime.UtcNow.Date,
            TotalQuestions = 0,
            CorrectAnswers = 0,
            TotalScore = 0,
            AccuracyPercentage = 0,
            TimeSpentSeconds = 0
        };

        _context.QuizSessions.Add(quizSession);
        await _context.SaveChangesAsync();

        return quizSession;
    }

    public async Task<QuizAttempt> SubmitQuizAttemptAsync(Guid userId, Guid quizSessionId, QuizAttemptDto attemptDto)
    {
        var question = await _context.Questions.FindAsync(attemptDto.QuestionId);
        if (question == null)
        {
            throw new ArgumentException("Question not found", nameof(attemptDto.QuestionId));
        }

        var quizSession = await _context.QuizSessions.FindAsync(quizSessionId);
        if (quizSession == null)
        {
            throw new ArgumentException("Quiz session not found", nameof(quizSessionId));
        }

        // Check if user already attempted this question in this session
        var existingAttempt = await _context.QuizAttempts
            .FirstOrDefaultAsync(qa => qa.UserId == userId && qa.QuestionId == attemptDto.QuestionId && qa.QuizSessionId == quizSessionId);
        
        if (existingAttempt != null)
        {
            throw new InvalidOperationException("User has already attempted this question in this session");
        }

        var isCorrect = attemptDto.SelectedAnswer == question.CorrectIndex;
        
        var attempt = new QuizAttempt
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            QuestionId = attemptDto.QuestionId,
            QuizSessionId = quizSessionId,
            SelectedAnswer = attemptDto.SelectedAnswer,
            IsCorrect = isCorrect,
            TimeSpentSeconds = attemptDto.TimeSpentSeconds,
            AttemptedAt = DateTime.UtcNow
        };

        _context.QuizAttempts.Add(attempt);
        await _context.SaveChangesAsync();

        return attempt;
    }

    public async Task<QuizSession> SubmitQuizResultAsync(Guid userId, SubmitQuizResultDto resultDto)
    {
        // Create a new quiz session
        var quizSession = await CreateQuizSessionAsync(userId, resultDto.Category);
        var attempts = new List<QuizAttempt>();
        var totalTimeSpent = 0;

        foreach (var attemptDto in resultDto.Attempts)
        {
            try
            {
                var attempt = await SubmitQuizAttemptAsync(userId, quizSession.Id, attemptDto);
                attempts.Add(attempt);
                totalTimeSpent += attemptDto.TimeSpentSeconds;
            }
            catch (InvalidOperationException)
            {
                // Skip if already attempted
                _logger.LogWarning("User {UserId} already attempted question {QuestionId} in session {SessionId}", 
                    userId, attemptDto.QuestionId, quizSession.Id);
            }
        }

        // Update quiz session with final results
        var correctAnswers = attempts.Count(a => a.IsCorrect);
        var totalQuestions = attempts.Count;
        var totalScore = correctAnswers * 10; 
        var accuracyPercentage = totalQuestions > 0 ? (double)correctAnswers / totalQuestions * 100 : 0;

        quizSession.CompletedAt = DateTime.UtcNow;
        quizSession.TotalQuestions = totalQuestions;
        quizSession.CorrectAnswers = correctAnswers;
        quizSession.TotalScore = totalScore;
        quizSession.AccuracyPercentage = accuracyPercentage;
        quizSession.TimeSpentSeconds = totalTimeSpent;

        await _context.SaveChangesAsync();

        // Update user's overall category score (for backward compatibility)
        await UpdateUserScoresAsync(userId, resultDto.Category);

        // Process daily leaderboard for this date
        await ProcessDailyLeaderboardAsync(resultDto.Category, quizSession.Date);

        return quizSession;
    }

    public async Task UpdateUserScoresAsync(Guid userId, string category)
    {
        // This method now aggregates all quiz sessions for a category
        var quizSessions = await _context.QuizSessions
            .Where(qs => qs.UserId == userId && qs.Category == category && qs.CompletedAt != null)
            .ToListAsync();

        var totalQuestions = quizSessions.Sum(qs => qs.TotalQuestions);
        var correctAnswers = quizSessions.Sum(qs => qs.CorrectAnswers);
        var totalScore = correctAnswers * 10; // 10 points per correct answer

        var userScore = await _context.UserScores
            .FirstOrDefaultAsync(us => us.UserId == userId && us.Category == category);

        if (userScore == null)
        {
            userScore = new UserScore
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Category = category,
                TotalScore = totalScore,
                QuestionsAnswered = totalQuestions,
                CorrectAnswers = correctAnswers,
                LastUpdated = DateTime.UtcNow
            };
            _context.UserScores.Add(userScore);
        }
        else
        {
            userScore.TotalScore = totalScore;
            userScore.QuestionsAnswered = totalQuestions;
            userScore.CorrectAnswers = correctAnswers;
            userScore.LastUpdated = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<QuizSessionDto>> GetUserQuizSessionsAsync(Guid userId, string? category = null)
    {
        var query = _context.QuizSessions
            .Where(qs => qs.UserId == userId && qs.CompletedAt != null);

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(qs => qs.Category == category);
        }

        return await query
            .OrderByDescending(qs => qs.CompletedAt)
            .Select(qs => new QuizSessionDto
            {
                Id = qs.Id,
                Category = qs.Category,
                StartedAt = qs.StartedAt,
                CompletedAt = qs.CompletedAt,
                TotalQuestions = qs.TotalQuestions,
                CorrectAnswers = qs.CorrectAnswers,
                TotalScore = qs.TotalScore,
                AccuracyPercentage = qs.AccuracyPercentage,
                TimeSpentSeconds = qs.TimeSpentSeconds
            })
            .ToListAsync();
    }

    public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(string category, int limit = 10)
    {
        var leaderboard = await _context.QuizSessions
            .Include(qs => qs.User)
            .Where(qs => qs.Category == category && qs.CompletedAt != null)
            .OrderByDescending(qs => qs.TotalScore)
            .ThenByDescending(qs => qs.AccuracyPercentage)
            .ThenBy(qs => qs.TimeSpentSeconds) // Faster completion time is better for ties
            .Take(limit)
            .Select(qs => new LeaderboardEntryDto
            {
                UserName = qs.User.Name,
                AvatarUrl = qs.User.AvatarUrl,
                TotalScore = qs.TotalScore,
                QuestionsAnswered = qs.TotalQuestions,
                AccuracyPercentage = qs.AccuracyPercentage,
                CompletedAt = qs.CompletedAt ?? qs.StartedAt,
                TimeSpentSeconds = qs.TimeSpentSeconds
            })
            .ToListAsync();

        // Add rank
        for (int i = 0; i < leaderboard.Count; i++)
        {
            leaderboard[i].Rank = i + 1;
        }

        return leaderboard;
    }

    public async Task<List<LeaderboardEntryDto>> GetDailyLeaderboardAsync(string category, DateTime date, int limit = 10)
    {
        var leaderboard = await _context.QuizSessions
            .Include(qs => qs.User)
            .Where(qs => qs.Category == category && qs.CompletedAt != null && qs.Date == date.Date)
            .OrderByDescending(qs => qs.TotalScore)
            .ThenByDescending(qs => qs.AccuracyPercentage)
            .ThenBy(qs => qs.TimeSpentSeconds)
            .Take(limit)
            .Select(qs => new LeaderboardEntryDto
            {
                UserName = qs.User.Name,
                AvatarUrl = qs.User.AvatarUrl,
                TotalScore = qs.TotalScore,
                QuestionsAnswered = qs.TotalQuestions,
                AccuracyPercentage = qs.AccuracyPercentage,
                CompletedAt = qs.CompletedAt ?? qs.StartedAt,
                TimeSpentSeconds = qs.TimeSpentSeconds
            })
            .ToListAsync();

        // Add rank
        for (int i = 0; i < leaderboard.Count; i++)
        {
            leaderboard[i].Rank = i + 1;
        }

        return leaderboard;
    }

    public async Task<List<DailyLeaderboardDto>> GetHistoricalLeaderboardsAsync(string category, int days = 7)
    {
        var endDate = DateTime.UtcNow.Date;
        var startDate = endDate.AddDays(-days + 1);

        var historicalLeaderboards = new List<DailyLeaderboardDto>();

        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            var dailyLeaderboard = await GetDailyLeaderboardAsync(category, date, 10);
            historicalLeaderboards.Add(new DailyLeaderboardDto
            {
                Date = date,
                Category = category,
                Entries = dailyLeaderboard
            });
        }

        return historicalLeaderboards.OrderByDescending(dl => dl.Date).ToList();
    }

    public async Task<List<AllTimePodiumStatsDto>> GetAllTimePodiumStatsAsync(string category, int limit = 10)
    {
        var podiumStats = await _context.UserPodiumStats
            .Include(ups => ups.User)
            .Where(ups => ups.Category == category)
            .OrderByDescending(ups => (ups.FirstPlaceCount * 3) + (ups.SecondPlaceCount * 2) + ups.ThirdPlaceCount)
            .ThenByDescending(ups => ups.FirstPlaceCount)
            .ThenByDescending(ups => ups.SecondPlaceCount)
            .ThenByDescending(ups => ups.ThirdPlaceCount)
            .Take(limit)
            .Select(ups => new AllTimePodiumStatsDto
            {
                UserName = ups.User.Name,
                AvatarUrl = ups.User.AvatarUrl,
                FirstPlaceCount = ups.FirstPlaceCount,
                SecondPlaceCount = ups.SecondPlaceCount,
                ThirdPlaceCount = ups.ThirdPlaceCount,
                TotalPodiums = ups.FirstPlaceCount + ups.SecondPlaceCount + ups.ThirdPlaceCount,
                WeightedScore = (ups.FirstPlaceCount * 3) + (ups.SecondPlaceCount * 2) + ups.ThirdPlaceCount
            })
            .ToListAsync();

        // Add rank
        for (int i = 0; i < podiumStats.Count; i++)
        {
            podiumStats[i].Rank = i + 1;
        }

        return podiumStats;
    }

    public async Task ProcessDailyLeaderboardAsync(string category, DateTime date)
    {
        // Get the top 3 performers for the day
        var topPerformers = await _context.QuizSessions
            .Include(qs => qs.User)
            .Where(qs => qs.Category == category && qs.CompletedAt != null && qs.Date == date.Date)
            .OrderByDescending(qs => qs.TotalScore)
            .ThenByDescending(qs => qs.AccuracyPercentage)
            .ThenBy(qs => qs.TimeSpentSeconds)
            .Take(3)
            .ToListAsync();

        if (topPerformers.Count == 0) return;

        // Check if daily leaderboard already exists
        var existingLeaderboard = await _context.DailyLeaderboards
            .FirstOrDefaultAsync(dl => dl.Category == category && dl.Date == date.Date);

        if (existingLeaderboard != null)
        {
            // Update existing leaderboard
            existingLeaderboard.FirstPlaceUserId = topPerformers[0].UserId;
            existingLeaderboard.SecondPlaceUserId = topPerformers.Count > 1 ? topPerformers[1].UserId : null;
            existingLeaderboard.ThirdPlaceUserId = topPerformers.Count > 2 ? topPerformers[2].UserId : null;
        }
        else
        {
            // Create new daily leaderboard
            var dailyLeaderboard = new DailyLeaderboard
            {
                Id = Guid.NewGuid(),
                Category = category,
                Date = date.Date,
                FirstPlaceUserId = topPerformers[0].UserId,
                SecondPlaceUserId = topPerformers.Count > 1 ? topPerformers[1].UserId : null,
                ThirdPlaceUserId = topPerformers.Count > 2 ? topPerformers[2].UserId : null,
                CreatedAt = DateTime.UtcNow
            };
            _context.DailyLeaderboards.Add(dailyLeaderboard);
        }

        await _context.SaveChangesAsync();

        // Update podium stats for the top 3 performers
        await UpdatePodiumStatsAsync(category, topPerformers);
    }

    private async Task UpdatePodiumStatsAsync(string category, List<QuizSession> topPerformers)
    {
        for (int i = 0; i < topPerformers.Count; i++)
        {
            var userId = topPerformers[i].UserId;
            var podiumStats = await _context.UserPodiumStats
                .FirstOrDefaultAsync(ups => ups.UserId == userId && ups.Category == category);

            if (podiumStats == null)
            {
                podiumStats = new UserPodiumStats
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Category = category,
                    FirstPlaceCount = 0,
                    SecondPlaceCount = 0,
                    ThirdPlaceCount = 0,
                    LastUpdated = DateTime.UtcNow
                };
                _context.UserPodiumStats.Add(podiumStats);
            }

            // Update the appropriate podium count
            switch (i)
            {
                case 0:
                    podiumStats.FirstPlaceCount++;
                    break;
                case 1:
                    podiumStats.SecondPlaceCount++;
                    break;
                case 2:
                    podiumStats.ThirdPlaceCount++;
                    break;
            }

            podiumStats.LastUpdated = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }

    // Keep the old method for backward compatibility
    public async Task<List<UserScore>> GetUserScoresAsync(Guid userId)
    {
        return await _context.UserScores
            .Where(us => us.UserId == userId)
            .OrderByDescending(us => us.TotalScore)
            .ToListAsync();
    }
}