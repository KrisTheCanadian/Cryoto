using API.Hub;
using API.Models.Notifications;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using API.Utils;
using Azure.Communication.Email;
using Azure.Communication.Email.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationsHub> _hubContext;
    private readonly INotificationRepository _repository;
    private readonly ILogger<NotificationService> _logger;
    private readonly IUserProfileRepository _userProfileRepository;
    private const string SenderEmail = "Cryoto@31286fb0-ff2a-4420-8b82-32f62d53c117.azurecomm.net";
    private readonly string _emailConnectionString;


    public NotificationService(IHubContext<NotificationsHub> hubContext, INotificationRepository repository, ILogger<NotificationService> logger, IUserProfileRepository userProfileRepository, IConfiguration configuration)
    {
        _hubContext = hubContext;
        _repository = repository;
        _logger = logger;
        _userProfileRepository = userProfileRepository;
        _emailConnectionString = configuration["CryotoCommunicationsServiceConnectionString"];
    }

    public async Task SendEmailAsync(string to, string subject, string message, bool isHtml = false)
    {
        try {
            var emailClient = new EmailClient(_emailConnectionString);
            var emailContent = isHtml ? new EmailContent(subject) {Html = message} : new EmailContent(subject) { PlainText = message };
            var emailAddresses = new List<EmailAddress> { new (to) };
            var emailMessage = new EmailMessage(SenderEmail, emailContent, new EmailRecipients(emailAddresses) );
            
            var emailResult = await emailClient.SendAsync(emailMessage, CancellationToken.None);
            
            await emailClient.GetSendStatusAsync(emailResult.Value.MessageId);
            
        } catch (Exception e)
        {
            _logger.LogError(e, "Error sending email");
        }
    }

    public async Task SendEmailsAsync(List<string> to, string subject, string message, bool isHtml = false)
    {
        try {
            var emailClient = new EmailClient(_emailConnectionString);
            var emailContent = isHtml ? new EmailContent(subject) {Html = message} : new EmailContent(subject) { PlainText = message };
            var emailAddresses = to.Select(x => new EmailAddress(x)).ToList();
            var emailMessage = new EmailMessage(SenderEmail, emailContent, new EmailRecipients(emailAddresses) );
            
            var emailResult = await emailClient.SendAsync(emailMessage, CancellationToken.None);
            
            await emailClient.GetSendStatusAsync(emailResult.Value.MessageId);
            
        } catch (Exception e)
        {
            _logger.LogError(e, "Error sending email");
        }
    }

    public async Task SendNotificationAsync(Notification notification)
    {
        var sender = notification.SenderId == "System" ? null : await _userProfileRepository.GetUserByIdAsync(notification.SenderId);
        var receiver = await _userProfileRepository.GetUserByIdAsync(notification.ReceiverId);
        
        if(sender != null){ notification.SenderName = sender.Name; }
        if (receiver != null) { notification.ReceiverName = receiver.Name; }

        await _hubContext.Clients.Groups(notification.ReceiverId)
            .SendAsync("ReceiveNotification", notification);
        
        _logger.LogInformation("Notification sent to user {UserId}", notification.ReceiverId);

        var isCreated = await _repository.CreateNotificationAsync(notification);
        if (!isCreated) { _logger.LogError("Notification not created"); }
    }

    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string actorId)
    {
        return await _repository.GetUserNotificationsAsync(actorId);
    }

    public async Task<Notification?> GetNotificationAsync(string id)
    {
        return await _repository.GetNotificationAsync(id);
    }

    public async Task<bool> UpdateReadAsync(string id)
    {
        return await _repository.UpdateReadAsync(id);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<PaginationWrapper<Notification>> GetNotificationsPaginatedAsync(string actorId, int page, int pageSize)
    {
        return await _repository.GetNotificationsPaginatedAsync(actorId, page, pageSize);
    }
}