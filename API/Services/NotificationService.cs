using API.Hub;
using API.Models.Notifications;
using API.Models.Posts;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using API.Utils;
using Azure.Communication.Email;
using Azure.Communication.Email.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.Services;

public class NotificationService : INotificationService
{
    private const string SenderEmail = "Cryoto@31286fb0-ff2a-4420-8b82-32f62d53c117.azurecomm.net";
    private readonly string _emailConnectionString;
    private readonly IHubContext<NotificationsHub> _hubContext;
    private readonly ILogger<NotificationService> _logger;
    private readonly INotificationRepository _repository;
    private readonly IUserProfileRepository _userProfileRepository;


    public NotificationService(IHubContext<NotificationsHub> hubContext, INotificationRepository repository,
        ILogger<NotificationService> logger, IUserProfileRepository userProfileRepository,
        IConfiguration configuration)
    {
        _hubContext = hubContext;
        _repository = repository;
        _logger = logger;
        _userProfileRepository = userProfileRepository;
        _emailConnectionString = configuration["CryotoCommunicationsServiceConnectionString"];
    }

    public async Task SendEmailAsync(string to, string subject, string message, bool isHtml = false)
    {
        try
        {
            var emailClient = new EmailClient(_emailConnectionString);
            var emailContent = isHtml
                ? new EmailContent(subject) { Html = message }
                : new EmailContent(subject) { PlainText = message };
            var emailAddresses = new List<EmailAddress> { new(to) };
            var emailMessage = new EmailMessage(SenderEmail, emailContent, new EmailRecipients(emailAddresses));

            var emailResult = await emailClient.SendAsync(emailMessage, CancellationToken.None);

            await emailClient.GetSendStatusAsync(emailResult.Value.MessageId);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error sending email");
        }
    }

    public async Task SendNotificationAsync(Notification notification)
    {
        var sender = notification.SenderId == "System"
            ? null
            : await _userProfileRepository.GetUserByIdAsync(notification.SenderId);
        var receiver = await _userProfileRepository.GetUserByIdAsync(notification.ReceiverId);

        if (sender != null) notification.SenderName = sender.Name;
        if (receiver != null) notification.ReceiverName = receiver.Name;

        await _hubContext.Clients.Groups(notification.ReceiverId)
            .SendAsync("ReceiveNotification", notification);

        _logger.LogInformation("Notification sent to user {UserId}", notification.ReceiverId);

        var isCreated = await _repository.CreateNotificationAsync(notification);
        if (!isCreated) _logger.LogError("Notification not created");
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

    public async Task<PaginationWrapper<Notification>> GetNotificationsPaginatedAsync(string actorId, int page,
        int pageSize)
    {
        return await _repository.GetNotificationsPaginatedAsync(actorId, page, pageSize);
    }

    public async Task<bool> SendReactionNotification(string actorId, int type, PostModel post)
    {
        var react = type switch
        {
            0 => post.Hearts.Contains(actorId),
            1 => post.Claps.Contains(actorId),
            2 => post.Claps.Contains(actorId),
            _ => true
        };

        if (!react) return true;

        string ReactionMessage(int reactionType)
        {
            return reactionType switch
            {
                0 => "loved",
                1 => "clapped to",
                2 => "celebrated",
                _ => ""
            };
        }

        var actorProfile = await _userProfileRepository.GetUserByIdAsync(actorId);
        // Send Notification to Post Author
        if (post.Author != actorId)
        {
            // public Notification(string senderId, string receiverId, string message, string type, double amount)
            var notification = new Notification(
                actorId,
                post.Author,
                $"{actorProfile!.Name} {ReactionMessage(type)} your post.",
                "Reaction",
                null
            );

            await SendNotificationAsync(notification);

            // send email notification
            if (actorProfile.EmailNotifications)
                await SendEmailAsync(post.Author, "New Reaction",
                    $"<h1>{actorProfile.Name} {ReactionMessage(type)} your post.</h1>");
        }

        foreach (var postRecipient in post.RecipientProfiles)
            if (postRecipient.OId != actorId)
            {
                // Send Notification to Post Recipients
                // public Notification(string senderId, string receiverId, string message, string type, double amount)
                var notificationToPostRecipient = new Notification(
                    actorId,
                    postRecipient.OId,
                    $"{actorProfile!.Name} {ReactionMessage(type)} a post you are recognized in.",
                    "Reaction",
                    null
                );

                await SendNotificationAsync(notificationToPostRecipient);

                // get user profile of post recipient
                var postRecipientProfile = await _userProfileRepository.GetUserByIdAsync(postRecipient.OId);

                // send email notification
                if (postRecipientProfile != null && postRecipientProfile.EmailNotifications)
                    await SendEmailAsync(postRecipient.OId, "New Reaction",
                        $"<h1>{actorProfile.Name} {ReactionMessage(type)} a post you are recognized in.</h1>");
            }

        return true;
    }

    public async Task<bool> SendCommentNotification(string actorId, string postId, PostModel post)
    {
        var commentAuthor = await _userProfileRepository.GetUserByIdAsync(actorId);
        if (commentAuthor == null)
        {
            _logger.LogError("Could not retrieve user profile of user '{ActorId}'", actorId);
            return false;
        }

        var postAuthor = post.AuthorProfile;
        if (postAuthor == null)
        {
            _logger.LogError("Could not retrieve author profile of post '{PostId}'", postId);
            return false;
        }

        // Send Notification to Post Author
        if (post.Author != actorId)
        {
            // public Notification(string senderId, string receiverId, string message, string type, double? amount)
            var notification = new Notification(
                actorId,
                post.Author,
                $"{commentAuthor.Name} commented on your post.",
                "Comment",
                null
            );

            await SendNotificationAsync(notification);

            // get user profile of post author
            var postAuthorProfile = await _userProfileRepository.GetUserByIdAsync(post.Author);

            // send email notification
            if (postAuthorProfile != null && postAuthorProfile.EmailNotifications)
                await SendEmailAsync(post.Author, "New Comment",
                    $"<h1>{commentAuthor.Name} commented on your post.</h1>");
        }

        // Send Notification to Post Recipients
        foreach (var postRecipient in post.RecipientProfiles)
            if (postRecipient.OId != actorId)
            {
                var notificationToPostRecipient = new Notification(
                    actorId,
                    postRecipient.OId,
                    $"{commentAuthor.Name} commented on a post you are recognized in.",
                    "Comment",
                    null
                );

                await SendNotificationAsync(notificationToPostRecipient);

                // get user profile of post recipient
                var postRecipientProfile = await _userProfileRepository.GetUserByIdAsync(postRecipient.OId);

                // send email notification
                if (postRecipientProfile != null && postRecipientProfile.EmailNotifications)
                    await SendEmailAsync(postRecipient.OId, "New Comment",
                        $"<h1>{commentAuthor.Name} commented on a post you are recognized in.</h1>");
            }

        return true;
    }

    public async Task<bool> SendBoostNotification(string actorId, PostModel post)
    {
        var actorProfile = await _userProfileRepository.GetUserByIdAsync(actorId);
        // Send Notification to Post Author
        if (post.Author != actorId)
        {
            // public Notification(string senderId, string receiverId, string message, string type, double amount)
            var notification = new Notification(
                actorId,
                post.Author,
                $"{actorProfile!.Name} boosted your post.",
                "Boost",
                null
            );

            await SendNotificationAsync(notification);

            // get user profile of post author
            var postAuthorProfile = await _userProfileRepository.GetUserByIdAsync(post.Author);

            // send email notification
            if (postAuthorProfile != null && postAuthorProfile.EmailNotifications)
                await SendEmailAsync(post.Author, "New Boost",
                    $"<h1>{actorProfile.Name} boosted your post.</h1>");
        }

        foreach (var postRecipient in post.RecipientProfiles)
            if (postRecipient.OId != actorId)
            {
                // Send Notification to Post Recipients
                // public Notification(string senderId, string receiverId, string message, string type, double amount)
                var notificationToPostRecipient = new Notification(
                    actorId,
                    postRecipient.OId,
                    $"{actorProfile!.Name} boosted a post you are recognized in.",
                    "Boost",
                    null
                );

                await SendNotificationAsync(notificationToPostRecipient);

                // get user profile of post recipient
                var postRecipientProfile = await _userProfileRepository.GetUserByIdAsync(postRecipient.OId);

                // send email notification
                if (postRecipientProfile != null && postRecipientProfile.EmailNotifications)
                    await SendEmailAsync(postRecipient.OId, "New Boost",
                        $"<h1>{actorProfile.Name} boosted a post you are recognized in.</h1>");
            }

        return true;
    }
}