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
public class NotificationController : ControllerBase
{
    public string ActorId;
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService, IHttpContextAccessor contextAccessor)
    {
        _notificationService = notificationService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        ActorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpGet]
    public async Task<ActionResult<PaginationWrapper<Notification>>> GetNotificationsPaginated([FromQuery] int page,
        [FromQuery] int pageSize)
    {
        return Ok(await _notificationService.GetNotificationsPaginatedAsync(ActorId, page, pageSize));
    }

    [HttpPost]
    public async Task<ActionResult> ReadNotification(string id)
    {
        var notification = await _notificationService.GetNotificationAsync(id);
        if (notification == null) return Conflict($"Notification {id}.");
        // validate if the user is the receiver
        if (notification.ReceiverId != ActorId)
            return Conflict($"User {ActorId} does not have access to modify notification {id}.");
        var updated = await _notificationService.UpdateReadAsync(id);
        if (!updated) return BadRequest("Cannot mark post as read.");

        return Ok();
    }
}