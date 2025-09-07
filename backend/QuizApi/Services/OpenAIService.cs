using Azure.AI.OpenAI;
using QuizApi.Models;
using System.Text.Json;
using QuizApi.Dtos;

namespace QuizApi.Services;

public interface IOpenAIService
{
    Task<List<QuestionFromOpenAI>> GenerateQuestionsAsync(string category, int count, List<string> existingQuestions);
} 

public class QuestionFromOpenAI
{
    public Guid Id { get; set; } = Guid.Empty;
    public string Question { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public int CorrectIndex { get; set; } = 0;
    public string Source { get; set; } = string.Empty;
}



public class OpenAIService : IOpenAIService
{
    private readonly OpenAIClient _client;
    private readonly ILogger<OpenAIService> _logger;
    private readonly string _deploymentName;

    public OpenAIService(IConfiguration configuration, ILogger<OpenAIService> logger)
    {
        var endpoint = configuration["AzureOpenAI__Endpoint"]!;
        var apiKey = configuration["AzureOpenAI__ApiKey"]!;
        _deploymentName = configuration["AzureOpenAI__DeploymentName"]!;
        
        _client = new OpenAIClient(new Uri(endpoint), new Azure.AzureKeyCredential(apiKey));
        _logger = logger;
    }

    public async Task<List<QuestionFromOpenAI>> GenerateQuestionsAsync(string category, int count, List<string> existingQuestions)
    {
        var prompt = $@"Generate {count} random multiple-choice quiz questions about {category} with 4 answer options each.

Here are previously generated questions that you should NOT duplicate or rephrase:
{string.Join("\n", existingQuestions)}

Format the response as a JSON array with each question having the following structure:
{{
  ""question"": ""The question text"",
  ""options"": [""Option A"", ""Option B"", ""Option C"", ""Option D""],
  ""correctIndex"": 0,
  ""source"": ""News source where this information comes from (e.g., CNN, BBC, Reuters)""
}}

Make sure the questions:
1. Are diverse and interesting
2. Have the correct answer as one of the options
3. Include a real and relevant news source
4. Are COMPLETELY DIFFERENT from the previously generated questions listed above
5. Cover different aspects of the topic than the previous questions.";

        var chatCompletionsOptions = new ChatCompletionsOptions
        {
            DeploymentName = _deploymentName,
            Messages =
            {
                new ChatRequestSystemMessage("You are a quiz question generator. Always respond with valid JSON arrays."),
                new ChatRequestUserMessage(prompt)
            },
            MaxTokens = 2000
        };

        var response = await _client.GetChatCompletionsAsync(chatCompletionsOptions);
        _logger.LogInformation("OpenAI API Response: {Response}", response.Value.Choices[0].Message.Content);
        var content = response.Value.Choices[0].Message.Content;

        // Extract JSON from response
        var jsonMatch = System.Text.RegularExpressions.Regex.Match(content, @"\[[\s\S]*\]");
        if (!jsonMatch.Success)
        {
            throw new InvalidOperationException("Failed to parse quiz questions from AI response");
        }

        var deserializeOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var questions = JsonSerializer.Deserialize<List<QuestionFromOpenAI>>(jsonMatch.Value, deserializeOptions);
        return questions ?? new List<QuestionFromOpenAI>();
    }
} 