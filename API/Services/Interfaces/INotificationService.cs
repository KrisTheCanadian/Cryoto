using API.Models.Notifications;
using API.Utils;

namespace API.Services.Interfaces;

public interface INotificationService
{
    public Task SendEmailAsync(string to, string subject, string message, bool isHtml = false);
    public Task SendEmailsAsync(List<string> to, string subject, string message, bool isHtml = false);
    public Task SendNotificationAsync(Notification notification);
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(string actorId);
    Task<Notification?> GetNotificationAsync(string id);
    Task<bool> UpdateReadAsync(string id);
    Task<bool> DeleteAsync(string id);
    Task<PaginationWrapper<Notification>> GetNotificationsPaginatedAsync(string actorId, int page, int pageSize);
}