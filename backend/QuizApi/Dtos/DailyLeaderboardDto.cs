namespace QuizApi.Dtos;

public class DailyLeaderboardDto
{
    public DateTime Date { get; set; }
    public string Category { get; set; } = string.Empty;
    public List<LeaderboardEntryDto> Entries { get; set; } = new();
}

public class AllTimePodiumStatsDto
{
    public string UserName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int FirstPlaceCount { get; set; }
    public int SecondPlaceCount { get; set; }
    public int ThirdPlaceCount { get; set; }
    public int TotalPodiums { get; set; }
    public int WeightedScore { get; set; }
    public int Rank { get; set; }
} 