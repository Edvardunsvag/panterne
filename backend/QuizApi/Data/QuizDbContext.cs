using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using QuizApi.Models;

namespace QuizApi.Data;

public class QuizDbContext(DbContextOptions<QuizDbContext> options) : DbContext(options)
{
    public DbSet<Question> Questions { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserScore> UserScores { get; set; }
    public DbSet<QuizAttempt> QuizAttempts { get; set; }
    public DbSet<QuizSession> QuizSessions { get; set; }
    public DbSet<DailyLeaderboard> DailyLeaderboards { get; set; }
    public DbSet<UserPodiumStats> UserPodiumStats { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Question configuration
        modelBuilder.Entity<Question>()
            .Property(q => q.Options)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
            .HasColumnType("nvarchar(max)");

        // User configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.GitHubId)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // UserScore configuration
        modelBuilder.Entity<UserScore>()
            .HasIndex(us => new { us.UserId, us.Category })
            .IsUnique();

        modelBuilder.Entity<UserScore>()
            .HasOne(us => us.User)
            .WithMany(u => u.UserScores)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // QuizSession configuration
        modelBuilder.Entity<QuizSession>()
            .HasOne(qs => qs.User)
            .WithMany(u => u.QuizSessions)
            .HasForeignKey(qs => qs.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Add index for daily leaderboard queries
        modelBuilder.Entity<QuizSession>()
            .HasIndex(qs => new { qs.Category, qs.Date, qs.TotalScore });

        // QuizAttempt configuration
        modelBuilder.Entity<QuizAttempt>()
            .HasOne(qa => qa.User)
            .WithMany(u => u.QuizAttempts)
            .HasForeignKey(qa => qa.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<QuizAttempt>()
            .HasOne(qa => qa.Question)
            .WithMany()
            .HasForeignKey(qa => qa.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<QuizAttempt>()
            .HasOne(qa => qa.QuizSession)
            .WithMany(qs => qs.QuizAttempts)
            .HasForeignKey(qa => qa.QuizSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Prevent duplicate attempts for same user/question/session
        modelBuilder.Entity<QuizAttempt>()
            .HasIndex(qa => new { qa.UserId, qa.QuestionId, qa.QuizSessionId })
            .IsUnique();

        // DailyLeaderboard configuration
        modelBuilder.Entity<DailyLeaderboard>()
            .HasIndex(dl => new { dl.Category, dl.Date })
            .IsUnique();

        modelBuilder.Entity<DailyLeaderboard>()
            .HasOne(dl => dl.FirstPlaceUser)
            .WithMany()
            .HasForeignKey(dl => dl.FirstPlaceUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DailyLeaderboard>()
            .HasOne(dl => dl.SecondPlaceUser)
            .WithMany()
            .HasForeignKey(dl => dl.SecondPlaceUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DailyLeaderboard>()
            .HasOne(dl => dl.ThirdPlaceUser)
            .WithMany()
            .HasForeignKey(dl => dl.ThirdPlaceUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // UserPodiumStats configuration
        modelBuilder.Entity<UserPodiumStats>()
            .HasIndex(ups => new { ups.UserId, ups.Category })
            .IsUnique();

        modelBuilder.Entity<UserPodiumStats>()
            .HasOne(ups => ups.User)
            .WithMany()
            .HasForeignKey(ups => ups.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}