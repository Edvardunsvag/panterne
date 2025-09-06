using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using QuizApi.Data;
using QuizApi.Models;

namespace QuizApi.Services;

public interface IQuestionService
{
    Task<List<Question>> GenerateAndStoreAsync(string category, int count);
    Task<List<Question>> GetRecentByCategoryAsync(string category, int count = 10);
}

public class QuestionService : IQuestionService
{
    private readonly QuizDbContext _db;
    private readonly IOpenAIService _openAI;
    private readonly ILogger<QuestionService> _logger;

    public QuestionService(QuizDbContext db, IOpenAIService openAI, ILogger<QuestionService> logger)
    {
        _db = db;
        _openAI = openAI;
        _logger = logger;
    }

    public async Task<List<Question>> GenerateAndStoreAsync(string category, int count)
    {
        var existingQuestions = await _db.Questions
            .Select(q => q.QuestionText)
            .ToListAsync();

        var questionsFromOpenAI = await _openAI.GenerateQuestionsAsync(category, count, existingQuestions);

        var entities = new List<Question>();

        foreach (var dto in questionsFromOpenAI)
        {
            var options = dto.Options?.Where(o => !string.IsNullOrWhiteSpace(o)).ToList() ?? new List<string>();
            var correctIndex = dto.CorrectIndex;
        

            var entity = new Question
            {
                Id = Guid.NewGuid(),
                QuestionText = dto.Question,
                Options = options,
                CorrectIndex = correctIndex,
                Source = dto.Source,
                Category = category,
                GeneratedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
                QuestionHash = ComputeHash(dto.Question + "|" + string.Join("|", options))
            };

            entities.Add(entity);
        }

        // Optional: de-duplicate by hash against DB
        var existingHashes = await _db.Questions
            .Where(q => entities.Select(e => e.QuestionHash).Contains(q.QuestionHash))
            .Select(q => q.QuestionHash)
            .ToListAsync();

        var newEntities = entities.Where(e => !existingHashes.Contains(e.QuestionHash)).ToList();

        _db.Questions.AddRange(newEntities);
        await _db.SaveChangesAsync();

        return newEntities;
    }

    public async Task<List<Question>> GetRecentByCategoryAsync(string category, int count = 10)
    {
        ArgumentNullException.ThrowIfNull(category);

        if (count <= 0) count = 10;

        return await _db.Questions
            .AsNoTracking()
            .Where(q => q.Category == category)
            .OrderByDescending(q => q.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    private static string ComputeHash(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }
}