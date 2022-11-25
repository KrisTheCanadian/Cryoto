using System.Security.Claims;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using Azure.Communication.Email;
using Azure.Communication.Email.Models;
using Microsoft.Identity.Web;
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

    public async Task<UserProfileModel?> GetOrAddUserProfileService(string oid, ClaimsIdentity? identity)
    {
        // Return userProfile if it is already exist.
        var userProfileModel = await _context.GetUserProfileAsync(oid);
        if (userProfileModel != null) return userProfileModel;

        // Creat new userProfile if it does not exist.
        var uri = new Uri("https://my.api.mockaroo.com/workday.json?key=f8e15420");
        var mockarooResponse = await _client.GetStringAsync(uri);
        userProfileModel = JsonConvert.DeserializeObject<UserProfileModel>(mockarooResponse);

        userProfileModel!.OId = oid;
        userProfileModel.Name = identity?.FindFirst(ClaimConstants.Name)?.Value!;
        userProfileModel.Email = identity?.FindFirst(ClaimConstants.PreferredUserName)?.Value!;
        userProfileModel.Language = "en";
        userProfileModel.Roles = identity?.FindAll(ClaimConstants.Role).Select(x => x.Value).ToArray()!;
        if (await _context.AddUserProfileAsync(userProfileModel) <= 0) return null;
        await SendEmail(userProfileModel.Email);
        return userProfileModel;
    }

    private async Task<bool> SendEmail(string recipient)
    {
        try
        {
            var sender = "Cryoto@31286fb0-ff2a-4420-8b82-32f62d53c117.azurecomm.net";
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
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<List<UserProfileModel>> GetAllUsersService()
    {
        return await _context.GetAllUsersAsync();
    }

    public async Task<List<UserProfileModel>> GetSearchResultServiceAsync(string keywords)
    {
        return await _context.GetSearchResultAsync(keywords);
    }

    public async Task<UserProfileModel?> GetUserByIdAsync(string userId)
    {
        return await _context.GetUserById(userId);
    }
}