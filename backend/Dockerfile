# Use the official .NET 8 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY QuizApi/QuizApi.csproj QuizApi/
RUN dotnet restore QuizApi/QuizApi.csproj

# Copy everything else and build
COPY QuizApi/ QuizApi/
WORKDIR /src/QuizApi
RUN dotnet build QuizApi.csproj -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish QuizApi.csproj -c Release -o /app/publish

# Use the official .NET 8 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 80 (default for ASP.NET Core in containers)
EXPOSE 80

ENTRYPOINT ["dotnet", "QuizApi.dll"]
