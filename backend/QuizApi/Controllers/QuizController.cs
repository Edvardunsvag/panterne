using Microsoft.AspNetCore.Mvc;
using QuizApi.Dtos;
using QuizApi.Mappers;
using QuizApi.Models;
using QuizApi.Services;
using System.ComponentModel.DataAnnotations;

namespace QuizApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    private readonly IQuestionService _questionService;
    private readonly IQuestionMapper _questionMapper;
    private readonly ILogger<QuizController> _logger;

    public QuizController(IQuestionService questionService, IQuestionMapper questionMapper, ILogger<QuizController> logger)
    {
        _questionService = questionService;
        _questionMapper = questionMapper;
        _logger = logger;
    }


    [HttpGet("recent/{category}")]
    [ProducesResponseType(typeof(List<QuestionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<QuestionDto>>> GetRecentByCategory(
        [Required] string category, 
        [FromQuery] int count = 10)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            return BadRequest("Category is required.");
        }

        if (!QuizCategory.All.Contains(category))
        {
            return BadRequest($"Invalid category. Valid categories are: {string.Join(", ", QuizCategory.All)}");
        }

        if (count <= 0 || count > 100) count = 10;

        var items = await _questionService.GetRecentByCategoryAsync(category, count);
        var dtos = _questionMapper.ToDtoList(items);
        return Ok(dtos);
    }
}
