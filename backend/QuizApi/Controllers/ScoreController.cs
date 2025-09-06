using Microsoft.AspNetCore.Mvc;
using QuizApi.Dtos;
using QuizApi.Services;
using System.ComponentModel.DataAnnotations;

namespace QuizApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScoreController : ControllerBase
{
    private readonly IQuizScoreService _quizScoreService;
    private readonly IUserService _userService;
    private readonly ILogger<ScoreController> _logger;

    public ScoreController(IQuizScoreService quizScoreService, IUserService userService, ILogger<ScoreController> logger)
    {
        _quizScoreService = quizScoreService;
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("submit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> SubmitQuizResult([FromBody] SubmitQuizWithUserDto submitDto)
    {
        if (string.IsNullOrWhiteSpace(submitDto.GitHubId))
        {
            return BadRequest("GitHub ID is required");
        }

        var user = await _userService.GetUserByGitHubIdAsync(submitDto.GitHubId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        try
        {
            var quizSession = await _quizScoreService.SubmitQuizResultAsync(user.Id, submitDto.QuizResult);
            return Ok(new { 
                message = "Quiz result submitted successfully",
                quizSessionId = quizSession.Id,
                score = quizSession.TotalScore,
                accuracy = quizSession.AccuracyPercentage
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting quiz result for user {UserId}", user.Id);
            return BadRequest("Error submitting quiz result");
        }
    }

    [HttpGet("leaderboard/{category}")]
    [ProducesResponseType(typeof(List<LeaderboardEntryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<LeaderboardEntryDto>>> GetLeaderboard(
        [Required] string category,
        [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            return BadRequest("Category is required");
        }

        if (limit <= 0 || limit > 50) limit = 10;

        var leaderboard = await _quizScoreService.GetLeaderboardAsync(category, limit);
        return Ok(leaderboard);
    }

    [HttpGet("leaderboard/{category}/daily")]
    [ProducesResponseType(typeof(List<LeaderboardEntryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<LeaderboardEntryDto>>> GetDailyLeaderboard(
        [Required] string category,
        [FromQuery] DateTime? date = null,
        [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            return BadRequest("Category is required");
        }

        if (limit <= 0 || limit > 50) limit = 10;

        var targetDate = date ?? DateTime.UtcNow.Date;
        var leaderboard = await _quizScoreService.GetDailyLeaderboardAsync(category, targetDate, limit);
        return Ok(leaderboard);
    }

    [HttpGet("leaderboard/{category}/historical")]
    [ProducesResponseType(typeof(List<DailyLeaderboardDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<DailyLeaderboardDto>>> GetHistoricalLeaderboards(
        [Required] string category,
        [FromQuery] int days = 7)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            return BadRequest("Category is required");
        }

        if (days <= 0 || days > 30) days = 7;

        var historicalLeaderboards = await _quizScoreService.GetHistoricalLeaderboardsAsync(category, days);
        return Ok(historicalLeaderboards);
    }

    [HttpGet("podium-stats/{category}")]
    [ProducesResponseType(typeof(List<AllTimePodiumStatsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<AllTimePodiumStatsDto>>> GetAllTimePodiumStats(
        [Required] string category,
        [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            return BadRequest("Category is required");
        }

        if (limit <= 0 || limit > 50) limit = 10;

        var podiumStats = await _quizScoreService.GetAllTimePodiumStatsAsync(category, limit);
        return Ok(podiumStats);
    }
}
