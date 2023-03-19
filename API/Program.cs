using System.Diagnostics.CodeAnalysis;
using API.Crypto.Services;
using API.Crypto.Services.Interfaces;
using API.Hub;
using API.Repository;
using API.Repository.Interfaces;
using API.Services;
using API.Services.Interfaces;
using Azure.Identity;
using Azure.Storage.Queues;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace API;

[ExcludeFromCodeCoverage]
internal static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var configuration = builder.Configuration;
        var azureCredentialOptions = new DefaultAzureCredentialOptions
        {
            ExcludeEnvironmentCredential = true,
            ExcludeInteractiveBrowserCredential = true,
            ExcludeAzurePowerShellCredential = true,
            ExcludeSharedTokenCacheCredential = true,
            ExcludeVisualStudioCodeCredential = true,
            ExcludeVisualStudioCredential = true,
            // For local development.
            ExcludeAzureCliCredential = !builder.Environment.IsDevelopment(),
            // To be used for the pipeline.
            ExcludeManagedIdentityCredential = builder.Environment.IsDevelopment()
        };

// Add services to the container.

        builder.Services.AddControllers();
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.Authority = "https://login.microsoftonline.com/4ccf6cd1-34c6-4c18-9976-d94ae43d0f65/v2.0";
                options.Audience = "751147b8-8f35-402c-a1ac-8f775f5baae9";
                options.SaveToken = true;
            });


        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .AllowAnyMethod()
                    .WithOrigins(configuration.GetSection("AllowedOrigins").Value.Split(";").ToArray())
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });


        builder.Services.AddScoped<IDataContext, DataContext>();

        builder.Services.AddDbContext<DataContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("PostgresConnection"));
        });

        builder.Services.AddSignalR();

        builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();
        builder.Services.AddScoped<IUserProfileService, UserProfileService>();
        builder.Services.AddScoped<IMsGraphApiService, MsGraphApiService>();

        builder.Services.AddScoped<IPostRepository, PostRepository>();
        builder.Services.AddScoped<IPostService, PostService>();

        builder.Services.AddScoped<ICommentRepository, CommentRepository>();
        builder.Services.AddScoped<ICommentService, CommentService>();

        builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
        builder.Services.AddScoped<ITransactionService, TransactionService>();

        builder.Services.AddScoped<IWalletRepository, WalletRepository>();
        builder.Services.AddScoped<ISolanaService, SolanaService>();
        builder.Services.AddScoped<ICryptoService, CryptoService>();

        builder.Services.AddScoped<IAddressRepository, AddressRepository>();
        builder.Services.AddScoped<IAddressService, AddressService>();

        builder.Services.AddScoped<INotificationService, NotificationService>();
        builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

        builder.Services.AddScoped<IMarketPlaceService, MarketPlaceService>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "oauth2"
                            },
                            Scheme = "oauth2",
                            Name = "oauth2",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Implicit = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl =
                                new Uri(
                                    "https://login.microsoftonline.com/4ccf6cd1-34c6-4c18-9976-d94ae43d0f65/oauth2/v2.0/authorize"),
                            TokenUrl = new Uri(
                                "https://login.microsoftonline.com/4ccf6cd1-34c6-4c18-9976-d94ae43d0f65/oauth2/v2.0/token"),
                            Scopes = new Dictionary<string, string>
                            {
                                { "api://751147b8-8f35-402c-a1ac-8f775f5baae9/AdminAccess", "" }
                            }
                        }
                    }
                });
            }
        );

        configuration.AddAzureKeyVault(
            new Uri("https://cryotovault.vault.azure.net/"),
            new DefaultAzureCredential(azureCredentialOptions));

        builder.Services.AddHostedService<CryotoBackgroundService>();
        builder.Services.AddAzureClients(factoryBuilder =>
        {
            factoryBuilder.AddClient<QueueClient, QueueClientOptions>(_ =>
            {
                var queueName = configuration.GetSection("queueName").Value;
                var queueConnectionString = configuration.GetSection("queueConnectionString").Value;
                return new QueueClient(queueConnectionString, queueName);
            });
        });

        builder.Services.AddHttpContextAccessor();
        builder.Services.AddControllers().AddNewtonsoftJson(options =>
            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);

        var app = builder.Build();

// Run migrations if needed
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<DataContext>();
            db.Database.Migrate();
        }


        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.OAuthAppName("Swagger Client");
            options.OAuthClientId(configuration.GetSection("OAuthClientId").Value);
            options.OAuthClientSecret(configuration.GetSection("OAuthClientSecret").Value);
            options.OAuthUseBasicAuthenticationWithAccessCodeGrant();
        });

        var option = new RewriteOptions();
        option.AddRedirect("^$", "swagger");

        app.UseRewriter(option);

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();
        app.MapHub<NotificationsHub>("/hub/notifications");
        app.UseCors();
        app.MapControllers();

        app.Run();
    }
}