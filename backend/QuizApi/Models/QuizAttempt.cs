namespace QuizApi.Models;

public class QuizAttempt
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid QuestionId { get; set; }
    public Guid QuizSessionId { get; set; } // New field to link to quiz session
    public int SelectedAnswer { get; set; }
    public bool IsCorrect { get; set; }
    public int TimeSpentSeconds { get; set; }
    public DateTime AttemptedAt { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Question Question { get; set; } = null!;
    public QuizSession QuizSession { get; set; } = null!; // New navigation property
} 