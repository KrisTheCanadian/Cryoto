using API.Models.Notifications;
using API.Utils;

namespace API.Repository.Interfaces;

public interface INotificationRepository
{
    Task<bool> CreateNotificationAsync(Notification notification);
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(string actorId);
    Task<Notification?> GetNotificationAsync(string id);
    Task<bool> UpdateReadAsync(string id);
    Task<bool> DeleteAsync(string id);
    Task<PaginationWrapper<Notification>> GetNotificationsPaginatedAsync(string actorId, int page, int pageSize);
}