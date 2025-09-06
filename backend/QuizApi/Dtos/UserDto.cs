namespace QuizApi.Dtos;

public class UserDto
{
    public Guid Id { get; set; }
    public string GitHubId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public DateTime LastLoginAt { get; set; }
}