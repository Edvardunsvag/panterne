namespace QuizApi.Models;

public class User
{
    public Guid Id { get; set; }
    public string GitHubId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime LastLoginAt { get; set; }
    
    // Navigation properties
    public ICollection<UserScore> UserScores { get; set; } = new List<UserScore>();
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    public ICollection<QuizSession> QuizSessions { get; set; } = new List<QuizSession>();
    public ICollection<UserPodiumStats> PodiumStats { get; set; } = new List<UserPodiumStats>();
} 