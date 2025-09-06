using QuizApi.Dtos;
using QuizApi.Models;

namespace QuizApi.Mappers;

public class UserMapper : IUserMapper
{
    public UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            GitHubId = user.GitHubId,
            Email = user.Email,
            Name = user.Name,
            AvatarUrl = user.AvatarUrl,
            LastLoginAt = user.LastLoginAt
        };
    }

    public List<UserDto> ToDtoList(List<User> users)
    {
        return users.Select(ToDto).ToList();
    }

    public UserScoreDto ToDto(UserScore userScore)
    {
        return new UserScoreDto
        {
            Id = userScore.Id,
            Category = userScore.Category,
            TotalScore = userScore.TotalScore,
            QuestionsAnswered = userScore.QuestionsAnswered,
            CorrectAnswers = userScore.CorrectAnswers,
            AccuracyPercentage = userScore.AccuracyPercentage,
            CompletedAt = userScore.LastUpdated, // Map LastUpdated to CompletedAt
            TimeSpentSeconds = 0 // Default value since UserScore doesn't have this field
        };
    }

    public List<UserScoreDto> ToDtoList(List<UserScore> userScores)
    {
        return userScores.Select(ToDto).ToList();
    }
} 