namespace QuizApi.Dtos;

public class QuizSessionDto
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int TotalScore { get; set; }
    public double AccuracyPercentage { get; set; }
    public int TimeSpentSeconds { get; set; }
} 