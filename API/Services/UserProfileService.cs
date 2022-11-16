using System.Security.Claims;
using API.Models.WorkDay;
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

    public async Task<UserProfileModel?> AddUserProfileService(ClaimsIdentity? identity)
    {
        var uri = new Uri("https://my.api.mockaroo.com/workday.json?key=f8e15420");
        var mockarooResponse = await _client.GetStringAsync(uri);
        var userProfileModel = JsonConvert.DeserializeObject<UserProfileModel>(mockarooResponse);

        userProfileModel!.OId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
        userProfileModel.Name = identity?.FindFirst(ClaimConstants.Name)?.Value!;
        userProfileModel.Email = identity?.FindFirst(ClaimConstants.PreferredUserName)?.Value!;
        userProfileModel.Language = "en";
        userProfileModel.Roles = identity?.FindAll(ClaimConstants.Role).Select(x => x.Value).ToArray()!;
        if (await _context.AddUserProfileAsync(userProfileModel) <= 0) return null;
        await SendEmail(userProfileModel.Email);
        return userProfileModel;
    }

    public async Task<bool> SendEmail(string recipient)
    {
        try
        {
            var sender = "CrtyotoDoNotReply@929e81fa-ad7a-4383-b58b-d29e7c30c895.azurecomm.net";
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

    public async Task<UserProfileModel?> GetUserProfileService(string oid)
    {
        return await _context.GetUserProfileAsync(oid);
    }

    public async Task<UserProfileModel?> GetUserByIdAsync(string userId)
    {
        return await _context.GetUserById(userId);
    }
}