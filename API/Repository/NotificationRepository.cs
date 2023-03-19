using API.Models.Notifications;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Utils;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class NotificationRepository : INotificationRepository
{
    private readonly IDataContext _context;

    public NotificationRepository(IDataContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateNotificationAsync(Notification notification)
    {
        await _context.Notifications.AddAsync(notification);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string actorId)
    {
        var notifications = await _context.Notifications.AsNoTracking()
            .Where(x => x.ReceiverId.Equals(actorId))
            .OrderByDescending(x => x.Created)
            .ToListAsync();

        await GetSenderAndReceiverNames(notifications);

        return notifications;
    }

    public async Task<Notification?> GetNotificationAsync(string id)
    {
        return await _context.Notifications.AsNoTracking().FirstOrDefaultAsync(x => x.Id.ToString().Equals(id));
    }

    public async Task<bool> UpdateReadAsync(string id)
    {
        var existing = await GetNotificationAsync(id);
        if (existing == null) return false;
        existing.Seen = true;
        _context.Notifications.Update(existing);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await GetNotificationAsync(id);
        if (existing == null) return false;
        _context.Notifications.Remove(existing);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<PaginationWrapper<Notification>> GetNotificationsPaginatedAsync(string actorId, int page,
        int pageSize)
    {
        pageSize = pageSize < 1 ? 10 : pageSize;
        page = page < 1 ? 1 : page;

        var notifications = await _context.Notifications
            .Where(x => x.ReceiverId.Equals(actorId))
            .AsNoTracking()
            .OrderByDescending(x => x.Created)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalNumberOfNotifications = _context.Notifications.Count();
        var totalNumberOfPages = totalNumberOfNotifications / pageSize + 1;

        await GetSenderAndReceiverNames(notifications);

        return new PaginationWrapper<Notification>(notifications, page, pageSize, totalNumberOfPages);
    }

    private async Task GetSenderAndReceiverNames(List<Notification> notifications)
    {
        foreach (var notification in notifications)
        {
            var senderProfile = await GetUserProfileAsync(notification.SenderId);
            var receiverProfile = await GetUserProfileAsync(notification.ReceiverId);
            if (senderProfile != null) notification.SenderName = senderProfile.Name;

            if (receiverProfile != null) notification.ReceiverName = receiverProfile.Name;
        }
    }

    private async Task<UserProfileModel?> GetUserProfileAsync(string userId)
    {
        return await _context.UserProfiles.AsNoTracking()
            .FirstOrDefaultAsync(x => x.OId.Equals(userId));
    }
}