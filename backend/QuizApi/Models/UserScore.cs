namespace QuizApi.Models;

public class UserScore
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public int TotalScore { get; set; }
    public int QuestionsAnswered { get; set; }
    public int CorrectAnswers { get; set; }
    public DateTime LastUpdated { get; set; }
    
    // Navigation property
    public User User { get; set; } = null!;
    
    // Calculated properties
    public double AccuracyPercentage => QuestionsAnswered > 0 ? (double)CorrectAnswers / QuestionsAnswered * 100 : 0;
} 