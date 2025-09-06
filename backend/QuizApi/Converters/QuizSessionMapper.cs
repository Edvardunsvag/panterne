using QuizApi.Dtos;
using QuizApi.Models;

namespace QuizApi.Mappers;

public class QuizSessionMapper : IQuizSessionMapper
{
    public QuizSessionDto ToDto(QuizSession quizSession)
    {
        return new QuizSessionDto
        {
            Id = quizSession.Id,
            Category = quizSession.Category,
            StartedAt = quizSession.StartedAt,
            CompletedAt = quizSession.CompletedAt,
            TotalQuestions = quizSession.TotalQuestions,
            CorrectAnswers = quizSession.CorrectAnswers,
            TotalScore = quizSession.TotalScore,
            AccuracyPercentage = quizSession.AccuracyPercentage,
            TimeSpentSeconds = quizSession.TimeSpentSeconds
        };
    }

    public List<QuizSessionDto> ToDtoList(List<QuizSession> quizSessions)
    {
        return quizSessions.Select(ToDto).ToList();
    }
}

public interface IQuizSessionMapper
{
    QuizSessionDto ToDto(QuizSession quizSession);
    List<QuizSessionDto> ToDtoList(List<QuizSession> quizSessions);
} 