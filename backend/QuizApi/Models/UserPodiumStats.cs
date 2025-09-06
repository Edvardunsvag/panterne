namespace QuizApi.Models;

public class UserPodiumStats
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public int FirstPlaceCount { get; set; }
    public int SecondPlaceCount { get; set; }
    public int ThirdPlaceCount { get; set; }
    public DateTime LastUpdated { get; set; }
    
    // Navigation property
    public User User { get; set; } = null!;
    
    // Calculated properties
    public int TotalPodiums => FirstPlaceCount + SecondPlaceCount + ThirdPlaceCount;
    public int WeightedScore => (FirstPlaceCount * 3) + (SecondPlaceCount * 2) + ThirdPlaceCount;
} 