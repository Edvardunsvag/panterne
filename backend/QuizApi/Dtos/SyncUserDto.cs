namespace QuizApi.Dtos;

public class SyncUserDto
{
    public string GitHubId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}