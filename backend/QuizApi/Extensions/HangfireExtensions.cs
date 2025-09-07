using Hangfire;

namespace QuizApi.Extensions;

public static class HangfireExtensions
{
    public static void ConfigureHangfireJobs(this WebApplication app)
    {
        // Add a test job that runs immediately
        BackgroundJob.Enqueue<Services.IBackgroundJobService>(
            service => service.GenerateQuestionsForAllCategoriesAsync(5));
        
        // Add a simple test job
        BackgroundJob.Enqueue(() => Console.WriteLine($"Test job executed at {DateTime.UtcNow}"));
        
        // Add the recurring job
        RecurringJob.AddOrUpdate<Services.IBackgroundJobService>(
            "generate-daily-questions-all-categories",
            service => service.GenerateQuestionsForAllCategoriesAsync(10),
            Cron.Daily(6, 0),
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Utc // Use UTC for production
            });
            
        // Add a test recurring job that runs every minute
        RecurringJob.AddOrUpdate(
            "test-job",
            () => Console.WriteLine($"Test recurring job executed at {DateTime.UtcNow}"),
            Cron.Minutely);
    }
} 