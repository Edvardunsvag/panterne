using QuizApi.Dtos;
using QuizApi.Models;

namespace QuizApi.Mappers;

public interface IQuestionMapper
{
    QuestionDto ToDto(Question question);
    List<QuestionDto> ToDtoList(List<Question> questions);
}

public class QuestionMapper : IQuestionMapper
{
    public QuestionDto ToDto(Question question) => new QuestionDto
    {
        Id = question.Id,
        Question = question.QuestionText,
        Options = question.Options ?? [],
        CorrectIndex = question.CorrectIndex,
        Source = question.Source
    };

    public List<QuestionDto> ToDtoList(List<Question> questions)
    {
        return questions.Select(ToDto).ToList();
    }
}