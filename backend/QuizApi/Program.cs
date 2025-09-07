using QuizApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add local configuration file
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

// Log connection string for debugging
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var maskedConnectionString = connectionString?.Replace("Password=", "Password=***").Replace("User ID=", "User ID=***");
builder.Services.AddLogging(logging => logging.AddConsole());
var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>();
logger.LogInformation("DefaultConnection: {ConnectionString}", maskedConnectionString);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddHangfireServices(builder.Configuration);

// Add CORS with environment-specific configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            // In production, specify allowed origins
            policy.WithOrigins("https://your-frontend-domain.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

// Setup database with better error handling
try
{
    await app.SetupDatabaseAsync();
}
catch (Exception ex)
{
    logger.LogError(ex, "Failed to setup database. Application will continue but database operations may fail.");
    // Don't throw here to allow the app to start even if DB setup fails
}

// Configure the HTTP request pipeline
app.ConfigureSwagger();

// Use CORS early in the pipeline
app.UseCors("AllowAll");

app.ConfigureMiddleware();
app.MapControllers();
app.ConfigureHangfire();

app.Run(); 