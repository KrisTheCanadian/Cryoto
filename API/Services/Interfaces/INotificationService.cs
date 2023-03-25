using API.Models.Notifications;
using API.Models.Posts;
using API.Utils;

namespace API.Services.Interfaces;

public interface INotificationService
{
    public Task SendEmailAsync(string to, string subject, string message, bool isHtml = false);
    public Task SendNotificationAsync(Notification notification);
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(string actorId);
    Task<Notification?> GetNotificationAsync(string id);
    Task<bool> UpdateReadAsync(string id);
    Task<bool> DeleteAsync(string id);
    Task<PaginationWrapper<Notification>> GetNotificationsPaginatedAsync(string actorId, int page, int pageSize);
    public Task<bool> SendReactionNotification(string actorId, int type, PostModel post);
    public Task<bool> SendCommentNotification(string actorId, string postId, PostModel post);
    public Task<bool> SendBoostNotification(string actorId, PostModel post);
}