using Hangfire;

namespace QuizApi.Extensions;

public static class HangfireExtensions
{
    public static void ConfigureHangfireJobs(this WebApplication app)
    {
        RecurringJob.AddOrUpdate<Services.IBackgroundJobService>(
            "generate-daily-questions-all-categories",
            service => service.GenerateQuestionsForAllCategoriesAsync(10),
            Cron.Daily(6, 0),
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Local
            });
    }
} 