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

// Add CORS directly here
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Setup database
await app.SetupDatabaseAsync();

// Configure the HTTP request pipeline
app.ConfigureSwagger();

// Use CORS early in the pipeline
app.UseCors("AllowAll");

app.ConfigureMiddleware();
app.MapControllers();
app.ConfigureHangfire();

app.Run(); 