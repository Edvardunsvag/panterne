using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using QuizApi.Data;
using QuizApi.Services;
using QuizApi.Mappers;

namespace QuizApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo 
            { 
                Title = "Quiz API", 
                Version = "v1",
                Description = "API for quiz application with daily question generation"
            });
        });
        
        return services;
    }

    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        // Log the connection string (mask sensitive parts)
        var maskedConnectionString = connectionString?.Replace("Password=", "Password=***").Replace("User ID=", "User ID=***");
        Console.WriteLine($"DefaultConnection: {maskedConnectionString}");
        
        services.AddDbContext<QuizDbContext>(options =>
            options.UseSqlServer(connectionString));
        
        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IQuestionService, QuestionService>();
        services.AddScoped<IOpenAIService, OpenAIService>();
        services.AddScoped<IQuestionMapper, QuestionMapper>();
        services.AddScoped<IBackgroundJobService, BackgroundJobService>();
        
        // User and scoring services
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IQuizScoreService, QuizScoreService>();
        services.AddScoped<IUserMapper, UserMapper>();
        services.AddScoped<IQuizSessionMapper, QuizSessionMapper>(); // Add the new mapper
        
        return services;
    }

    public static IServiceCollection AddHangfireServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        // Add validation
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("DefaultConnection connection string is not configured");
        }
        
        services.AddHangfire(config =>
        {
            config.UseSqlServerStorage(connectionString, new Hangfire.SqlServer.SqlServerStorageOptions
            {
                CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                QueuePollInterval = TimeSpan.Zero,
                UseRecommendedIsolationLevel = true,
                DisableGlobalLocks = true,
                SchemaName = "HangFire" // Explicit schema name
            });
            
            // Add logging
            config.UseDefaultTypeSerializer();
            config.UseRecommendedSerializerSettings();
        });
        
        // Configure Hangfire server with options
        services.AddHangfireServer(options =>
        {
            options.WorkerCount = Environment.ProcessorCount * 5;
            options.Queues = new[] { "default" };
            options.ServerName = Environment.MachineName; // Helps with debugging
        });
        
        return services;
    }

    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "https://yourdomain.com")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
        
        return services;
    }
} 