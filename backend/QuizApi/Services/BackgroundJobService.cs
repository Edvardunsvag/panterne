using Hangfire;
using QuizApi.Models;

namespace QuizApi.Services;

public interface IBackgroundJobService
{
    Task GenerateQuestionsForAllCategoriesAsync(int questionsPerCategory = 10);
}

public class BackgroundJobService : IBackgroundJobService
{
    private readonly IQuestionService _questionService;
    private readonly ILogger<BackgroundJobService> _logger;

    private const int QuestionsPerCategory = 10;
    private const int DailyHour = 6; // 6:00 AM

    public BackgroundJobService(IQuestionService questionService, ILogger<BackgroundJobService> logger)
    {
        _questionService = questionService;
        _logger = logger;
    }

    public async Task GenerateQuestionsForAllCategoriesAsync(int questionsPerCategory = 10)
    {
        _logger.LogInformation("Starting daily question generation for all categories");
        
        foreach (var category in QuizCategory.All)
        {
            try
            {
                _logger.LogInformation("Generating {Count} questions for category: {Category}", 
                    questionsPerCategory, category);
                
                await _questionService.GenerateAndStoreAsync(category, questionsPerCategory);
                
                _logger.LogInformation("Successfully generated questions for category: {Category}", category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate questions for category: {Category}", category);
            }
        }
        
        _logger.LogInformation("Completed daily question generation for all categories");
    }


} 