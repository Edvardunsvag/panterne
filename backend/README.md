# Quiz API Backend (.NET 8)

A .NET 8 Web API backend for the quiz application with daily question generation, uniqueness checking, and Hangfire scheduling.

## Features

- **Daily Question Generation**: Automated daily generation of quiz questions using Hangfire
- **Uniqueness Checking**: Prevents duplicate questions using hash comparison and text similarity
- **Azure OpenAI Integration**: Uses Azure OpenAI for question generation and embeddings
- **SQL Server Database**: Entity Framework Core with SQL Server
- **RESTful API**: Clean API endpoints for frontend integration
- **Hangfire Dashboard**: Monitor background jobs

## Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB for development)
- Azure OpenAI account and API key

## Setup Instructions

### 1. Clone and Navigate
```bash
cd backend/QuizApi
```

### 2. Install Dependencies
```bash
dotnet restore
```

### 3. Configure Settings

Update `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=QuizDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "your-api-key",
    "DeploymentName": "gpt-4o-mini"
  }
}
```

### 4. Create Database
```bash
dotnet ef database update
```

### 5. Run the Application
```bash
dotnet run
```

The API will be available at:
- **API**: `https://localhost:7000` or `http://localhost:5000`
- **Swagger**: `https://localhost:7000/swagger`
- **Hangfire Dashboard**: `https://localhost:7000/hangfire`

## API Endpoints

### Generate Quiz Questions
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "category": "General Knowledge"
}
```

### Get Questions by Category
```http
GET /api/quiz/{category}?limit=10
```

### Get Daily Generation Status
```http
GET /api/quiz/{category}/daily-status
```

## Available Categories

- General Knowledge
- Science
- History
- Geography
- Entertainment
- Sports
- Name of the Capitals of Europe
- American presidents

## Daily Generation

Questions are automatically generated daily at 6:00 AM using Hangfire. Each category has a limit of 10 questions per day to prevent over-generation.

## Docker Support

### Using Docker Compose
```bash
cd backend
docker-compose up -d
```

This will start:
- Quiz API on port 5000
- SQL Server on port 1433

### Environment Variables for Docker
- `ConnectionStrings__DefaultConnection`: SQL Server connection string
- `AzureOpenAI__Endpoint`: Azure OpenAI endpoint
- `AzureOpenAI__ApiKey`: Azure OpenAI API key
- `AzureOpenAI__DeploymentName`: Model deployment name

## Database Schema

### Questions Table
- `Id`: Unique identifier
- `QuestionText`: The question text
- `Options`: Answer options (pipe-separated)
- `CorrectAnswer`: The correct answer
- `Source`: News source
- `Category`: Question category
- `GeneratedAt`: When the question was generated
- `Embedding`: Text embedding for similarity (comma-separated floats)
- `QuestionHash`: Hash for duplicate detection
- `CreatedAt`: Record creation timestamp

### DailyGenerationLogs Table
- `Id`: Unique identifier
- `Category`: Question category
- `QuestionsGenerated`: Number of questions generated
- `GenerationDate`: Date of generation
- `CreatedAt`: Record creation timestamp

## Development

### Add Migration
```bash
dotnet ef migrations add MigrationName
```

### Update Database
```bash
dotnet ef database update
```

### Run Tests
```bash
dotnet test
```

## Production Deployment

1. Update connection string for production SQL Server
2. Set Azure OpenAI credentials
3. Configure CORS for your frontend domain
4. Deploy to Azure App Service, IIS, or Docker

## Troubleshooting

### SQL Server Connection Issues
- Ensure SQL Server LocalDB is installed
- Check connection string format
- Verify database permissions

### Azure OpenAI Issues
- Verify endpoint and API key
- Check deployment name matches your Azure resource
- Ensure sufficient quota for API calls

### Hangfire Issues
- Check SQL Server connection for Hangfire storage
- Verify background service is running
- Monitor Hangfire dashboard for job status 