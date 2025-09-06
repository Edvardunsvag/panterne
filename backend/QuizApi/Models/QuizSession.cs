namespace QuizApi.Models;

public class QuizSession
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime Date { get; set; } // New field for daily grouping
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int TotalScore { get; set; }
    public double AccuracyPercentage { get; set; }
    public int TimeSpentSeconds { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
} 