using Hangfire;
using QuizApi.Data;

namespace QuizApi.Extensions;

public static class HangfireExtensions
{
    public static void ConfigureHangfireJobs(this WebApplication app)
    {
        // Delay job configuration until the application is fully running
        // and database is ready
        _ = Task.Run(async () =>
        {
            // Wait for database to be ready
            await WaitForDatabaseReady(app);
            
            try
            {
                // Add the recurring job for daily question generation
                RecurringJob.AddOrUpdate<Services.IBackgroundJobService>(
                    "generate-daily-questions-all-categories",
                    service => service.GenerateQuestionsForAllCategoriesAsync(10),
                    Cron.Daily(6, 0),
                    new RecurringJobOptions
                    {
                        TimeZone = TimeZoneInfo.Utc // Use UTC for production
                    });
                    
                // Add a test recurring job that runs every minute (you can remove this in production)
                RecurringJob.AddOrUpdate(
                    "test-job",
                    () => Console.WriteLine($"Test recurring job executed at {DateTime.UtcNow}"),
                    Cron.Minutely);
                    
                Console.WriteLine("Hangfire jobs configured successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Could not configure Hangfire jobs: {ex.Message}");
                // Don't crash the app if Hangfire setup fails
            }
        });
    }
    
    private static async Task WaitForDatabaseReady(WebApplication app)
    {
        const int maxRetries = 60; // Increased from 30
        const int delayMs = 5000; // Increased from 2000

        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                using var scope = app.Services.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<QuizDbContext>();
                
                await dbContext.Database.CanConnectAsync();
                Console.WriteLine("Database is ready, configuring Hangfire jobs...");
                return; // Database is ready!
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Waiting for database... (attempt {i + 1}/{maxRetries}): {ex.Message}");
                await Task.Delay(delayMs);
            }
        }
        
        // Don't throw - just log and continue
        Console.WriteLine("Database did not become ready within the expected time limit, but Hangfire dashboard should still work");
    }
} 