namespace QuizApi.Dtos;

public class SubmitQuizResultDto
{
    public List<QuizAttemptDto> Attempts { get; set; } = new();
    public string Category { get; set; } = string.Empty; // Add category to track which quiz this belongs to
}