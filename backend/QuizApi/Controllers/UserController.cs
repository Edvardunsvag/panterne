using Microsoft.AspNetCore.Mvc;
using QuizApi.Dtos;
using QuizApi.Mappers;
using QuizApi.Services;
using System.ComponentModel.DataAnnotations;

namespace QuizApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IUserMapper _userMapper;
    private readonly IQuizScoreService _quizScoreService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserService userService, IUserMapper userMapper, IQuizScoreService quizScoreService, ILogger<UserController> logger)
    {
        _userService = userService;
        _userMapper = userMapper;
        _quizScoreService = quizScoreService;
        _logger = logger;
    }

    [HttpPost("sync")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> SyncUser([FromBody] SyncUserDto syncUserDto)
    {
        if (string.IsNullOrWhiteSpace(syncUserDto.GitHubId))
        {
            return BadRequest("GitHub ID is required");
        }

        var user = await _userService.GetOrCreateUserAsync(
            syncUserDto.GitHubId,
            syncUserDto.Email,
            syncUserDto.Name,
            syncUserDto.AvatarUrl);

        var userDto = _userMapper.ToDto(user);
        return Ok(userDto);
    }

    [HttpGet("{gitHubId}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUserByGitHubId([Required] string gitHubId)
    {
        var user = await _userService.GetUserByGitHubIdAsync(gitHubId);
        if (user == null)
        {
            return NotFound();
        }

        var userDto = _userMapper.ToDto(user);
        return Ok(userDto);
    }

    [HttpGet("{userId:guid}/scores")]
    [ProducesResponseType(typeof(List<UserScoreDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<UserScoreDto>>> GetUserScores(Guid userId)
    {
        var scores = await _userService.GetUserScoresAsync(userId);
        var scoreDtos = _userMapper.ToDtoList(scores);
        return Ok(scoreDtos);
    }

    [HttpGet("{userId:guid}/quiz-sessions")]
    [ProducesResponseType(typeof(List<QuizSessionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<QuizSessionDto>>> GetUserQuizSessions(
        Guid userId,
        [FromQuery] string? category = null)
    {
        var quizSessions = await _quizScoreService.GetUserQuizSessionsAsync(userId, category);
        return Ok(quizSessions);
    }
} 