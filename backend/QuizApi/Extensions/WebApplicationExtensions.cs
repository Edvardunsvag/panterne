using QuizApi.Data;
using Microsoft.EntityFrameworkCore;
using Hangfire;

namespace QuizApi.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigureSwagger(this WebApplication app)
    {
        if(app.Environment.IsDevelopment()){
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        
        return app;
    }

    public static WebApplication ConfigureMiddleware(this WebApplication app)
    {
        app.UseHttpsRedirection();
        app.UseAuthorization();
        
        return app;
    }

    public static WebApplication ConfigureHangfire(this WebApplication app)
    {
        // Always enable dashboard (not recommended for production)
        app.UseHangfireDashboard();
        app.ConfigureHangfireJobs();
        
        return app;
    }

    public static async Task<WebApplication> SetupDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<QuizDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        
        try
        {
            logger.LogInformation("Checking migration status...");
            
            var appliedMigrations = await db.Database.GetAppliedMigrationsAsync();
            var pendingMigrations = await db.Database.GetPendingMigrationsAsync();
            
            logger.LogInformation("Applied migrations: {Applied}", string.Join(", ", appliedMigrations));
            logger.LogInformation("Pending migrations: {Pending}", string.Join(", ", pendingMigrations));
            
            if (pendingMigrations.Any())
            {
                logger.LogInformation("Applying pending migrations...");
                await db.Database.MigrateAsync();
                logger.LogInformation("Migrations applied successfully");
            }
            else if (!appliedMigrations.Any())
            {
                logger.LogInformation("No migrations in history, creating database...");
                await db.Database.EnsureCreatedAsync();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during database setup");
            throw;
        }

        return app;
    }
} 