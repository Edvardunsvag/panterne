namespace QuizApi.Models;

public class Question
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public int CorrectIndex { get; set; }
    public string Source { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public string QuestionHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

