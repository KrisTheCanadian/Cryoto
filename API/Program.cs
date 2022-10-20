using API.Repository;
using API.Repository.Interfaces;
using API.Services;
using API.Services.Interfaces.Interfaces;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;
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
    ExcludeManagedIdentityCredential = builder.Environment.IsDevelopment(),
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
            .WithOrigins(configuration.GetSection("AllowedOrigins").Value.Split(";").ToArray())
            .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IDataContext, DataContext>();

builder.Services.AddEntityFrameworkNpgsql().AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("PostgresConnection"));
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
    {
        options.AddSecurityRequirement(new OpenApiSecurityRequirement()
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
                Implicit = new OpenApiOAuthFlow()
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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.OAuthAppName("Swagger Client");
        options.OAuthClientId(configuration.GetSection("OAuthClientId").Value);
        options.OAuthClientSecret(configuration.GetSection("OAuthClientSecret").Value);
        options.OAuthUseBasicAuthenticationWithAccessCodeGrant();
    });
}


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors();
app.MapControllers();

app.Run();