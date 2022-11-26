using System.Security.Claims;
using API.Models.Notifications;
using API.Services.Interfaces;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class NotificationController: ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly string _actorId;
    public NotificationController(INotificationService notificationService, IHttpContextAccessor contextAccessor)
    {
        _notificationService = notificationService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
    {
        return Ok(await _notificationService.GetUserNotificationsAsync(_actorId));
    }
    
    [HttpGet]
    public async Task<ActionResult<PaginationWrapper<Notification>>> GetNotificationsPaginated([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _notificationService.GetNotificationsPaginatedAsync(_actorId, page, pageSize));
    }

    [HttpPost]
    public async Task<ActionResult> ReadNotification(string id)
    {
        var notification = await _notificationService.GetNotificationAsync(id);
        if (notification == null)
        {
            return Conflict($"Notification {id}.");
        }
        // validate if the user is the receiver
        if(notification.ReceiverId != _actorId){ return Conflict($"User {_actorId} does not have access to modify notification {id}."); }
        var updated = await _notificationService.UpdateReadAsync(id);
        if (!updated) { return BadRequest("Cannot mark post as read."); }

        return Ok();
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteNotification(string id)
    {
        var notification = await _notificationService.GetNotificationAsync(id);
        if (notification == null) { return Conflict($"Notification {id}"); }
        // validate if the user is the receiver
        if(notification.SenderId != _actorId){ return Conflict($"User {_actorId} does not have access to modify notification {id}"); }
        var updated = await _notificationService.DeleteAsync(id);
        if (!updated) { return BadRequest("Cannot delete post."); }

        return Ok();
    }

}