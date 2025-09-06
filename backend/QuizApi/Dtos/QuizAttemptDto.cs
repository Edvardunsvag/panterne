namespace QuizApi.Dtos;

public class QuizAttemptDto
{
    public Guid QuestionId { get; set; }
    public int SelectedAnswer { get; set; }
    public int TimeSpentSeconds { get; set; }
}