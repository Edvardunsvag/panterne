namespace QuizApi.Dtos;

public class QuestionDto
{
    public Guid Id { get; set; } = Guid.Empty;
    public string Question { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public string Source { get; set; } = string.Empty;
    public int CorrectIndex { get; set; } = 0;
}