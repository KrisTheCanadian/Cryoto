using System.Diagnostics.CodeAnalysis;

namespace API.Hub;


[ExcludeFromCodeCoverage]
public class NotificationsHub : Microsoft.AspNetCore.SignalR.Hub
{
    private readonly ILogger<NotificationsHub> _logger;
    
    public NotificationsHub(ILogger<NotificationsHub> logger)
    {
        _logger = logger;
    }
    public async Task SubscribeToNotifications(string id)
    {
        _logger.LogInformation("{ConnectionId} subscribed to notifications {Id}", Context.ConnectionId, id);
        await Groups.AddToGroupAsync(Context.ConnectionId, id);
    }
}