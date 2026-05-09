# Use .NET 8 SDK for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

# Install EF Core Tools and apply migrations on startup (optional, we use code migrations in Program.cs)
ENTRYPOINT ["dotnet", "backend.dll"]
