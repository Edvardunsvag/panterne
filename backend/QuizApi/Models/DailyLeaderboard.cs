namespace QuizApi.Models;

public class DailyLeaderboard
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public Guid FirstPlaceUserId { get; set; }
    public Guid? SecondPlaceUserId { get; set; }
    public Guid? ThirdPlaceUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    public User FirstPlaceUser { get; set; } = null!;
    public User? SecondPlaceUser { get; set; }
    public User? ThirdPlaceUser { get; set; }
} 