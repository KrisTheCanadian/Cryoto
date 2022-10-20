using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using API.Models;
using API.Repository.Interfaces;
using API.Services.Interfaces.Interfaces;
using Azure.Communication.Email;
using Azure.Communication.Email.Models;
using Newtonsoft.Json;

namespace API.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IUserProfileRepository _context;
    private readonly HttpClient _client = new HttpClient();
    private readonly IConfiguration _configuration;

    public UserProfileService(IUserProfileRepository context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<UserWorkdayModel> GetUserWorkday()
    {
        var uri = new Uri("https://my.api.mockaroo.com/workday.json?key=f8e15420");
        var response = await _client.GetStringAsync(uri);
        var userWorkday = JsonConvert.DeserializeObject<UserWorkdayModel>(response);
        return userWorkday;
    }

    public UserProfileModel GetUserProfileDetails(string authorization)
    {
        if (!AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
        {
            throw new Exception("Invalid token");
        }

        var jwtToken = headerValue.Parameter;
        var claimsList = new JwtSecurityTokenHandler().ReadJwtToken(jwtToken).Claims;
        var claims = claimsList as Claim[] ?? claimsList.ToArray();
        var oId = claims.First(claim => claim.Type == "oid").Value;
        var name = claims.First(claim => claim.Type == "name").Value;
        var email = claims.First(claim => claim.Type == "preferred_username").Value;
        var roles = claims.First(claim => claim.Type == "roles").Value;
        UserProfileModel userDetails = new UserProfileModel(oId, name, email, "en", roles);

        return userDetails;
    }

    public async Task AddUserProfile(UserProfileModel user)
    {
        try
        {
            await _context.AddUserProfileAsync(user);
            SendEmail(user.Email, "CrtyotoDoNotReply@929e81fa-ad7a-4383-b58b-d29e7c30c895.azurecomm.net");
        }
        catch (Exception)
        {
            throw new Exception("Could not create a new account");
        }
    }

    public async void SendEmail(string recipient, string sender)
    {
        var connectionString = _configuration["CryotoCommunicationServiceConnectionString"];
        EmailClient emailClient = new EmailClient(connectionString);

        EmailContent emailContent = new EmailContent("Welcome to Cryoto APIs.")
        {
            PlainText = "Congratulations .....! your account was created successfully!"
        };
        List<EmailAddress> emailAddresses = new List<EmailAddress> { new EmailAddress(recipient) };
        EmailRecipients emailRecipients = new EmailRecipients(emailAddresses);
        EmailMessage emailMessage = new EmailMessage(sender, emailContent, emailRecipients);

        SendEmailResult emailResult = await emailClient.SendAsync(emailMessage, CancellationToken.None);
        await emailClient.GetSendStatusAsync(emailResult.MessageId);
    }

    public async Task<List<UserProfileModel>> GetAllUsersService()
    {
        return await _context.GetAllUsersAsync();
    }

    public async Task<UserProfileModel?> GetUserProfileService(string oid)
    {
        return await _context.GetUserProfileAsync(oid);
    }

    public async Task<int> AddUserProfileService(UserProfileModel user)
    {
        return await _context.AddUserProfileAsync(user);
    }
}