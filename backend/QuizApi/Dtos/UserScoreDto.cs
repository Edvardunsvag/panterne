namespace QuizApi.Dtos;

public class UserScoreDto
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public int TotalScore { get; set; }
    public int QuestionsAnswered { get; set; }
    public int CorrectAnswers { get; set; }
    public double AccuracyPercentage { get; set; }
    public DateTime CompletedAt { get; set; } // When the quiz was completed
    public int TimeSpentSeconds { get; set; } // Time taken for the quiz
}