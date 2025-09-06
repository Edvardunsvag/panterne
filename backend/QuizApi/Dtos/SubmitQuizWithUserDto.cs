namespace QuizApi.Dtos;

public class SubmitQuizWithUserDto
{
    public string GitHubId { get; set; } = string.Empty;
    public SubmitQuizResultDto QuizResult { get; set; } = new();
} 