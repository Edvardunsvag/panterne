 using QuizApi.Dtos;
using QuizApi.Models;

namespace QuizApi.Mappers;

public interface IUserMapper
{
    UserDto ToDto(User user);
    List<UserDto> ToDtoList(List<User> users);
    UserScoreDto ToDto(UserScore userScore);
    List<UserScoreDto> ToDtoList(List<UserScore> userScores);
}