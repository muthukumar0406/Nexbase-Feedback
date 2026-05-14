using backend.Data;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 10,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }));

// Configure Settings
builder.Services.Configure<AdminSettings>(builder.Configuration.GetSection("AdminSettings"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

// Configure Dependency Injection
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddSingleton<IEmailService, EmailService>();

builder.Services.AddControllers();

// Configure CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Apply migrations automatically with retries
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var context = services.GetRequiredService<AppDbContext>();
    
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var maskedConnectionString = string.Join(";", connectionString?.Split(';').Select(p => p.Trim().StartsWith("Password", StringComparison.OrdinalIgnoreCase) ? "Password=***" : p) ?? Enumerable.Empty<string>());
    logger.LogInformation("Using Connection String: {ConnectionString}", maskedConnectionString);
    
    int maxRetries = 10;
    int delaySeconds = 5;
    
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            logger.LogInformation("Attempting to apply migrations (Attempt {Attempt}/{MaxRetries})...", i + 1, maxRetries);
            
            // Check if we can connect
            if (context.Database.CanConnect())
            {
                if (context.Database.GetPendingMigrations().Any())
                {
                    context.Database.Migrate();
                    logger.LogInformation("Migrations applied successfully.");
                }
                else
                {
                    logger.LogInformation("No pending migrations found.");
                }
                break;
            }
            else
            {
                logger.LogWarning("Cannot connect to database yet. Retrying in {Delay}s...", delaySeconds);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database on attempt {Attempt}.", i + 1);
            if (i == maxRetries - 1) throw;
        }
        
        Thread.Sleep(TimeSpan.FromSeconds(delaySeconds));
    }
}

// Add a simple health check endpoint
app.MapGet("/ping", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }));

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Exception handling middleware (simple for now, could be expanded)
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync("An unexpected error occurred.");
    });
});

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();
