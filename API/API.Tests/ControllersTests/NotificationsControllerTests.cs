using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Models.Notifications;
using API.Services.Interfaces;
using API.Utils;
using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Xunit;

namespace API.Tests.ControllersTests;

public class NotificationsControllerTests
{
    private readonly NotificationController _controller;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly INotificationService _notificationService;

    public NotificationsControllerTests()
    {
        _notificationService = A.Fake<INotificationService>();
        _httpContextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new NotificationController(_notificationService, _httpContextAccessor);
    }

    [Fact]
    public async Task GetNotificationsPaginatedReturnsOkResult()
    {
        // Arrange
        A.CallTo(() =>
                _notificationService.GetNotificationsPaginatedAsync(A<string>.Ignored, A<int>.Ignored, A<int>.Ignored))
            .Returns(GetTestNotificationsPaginated());

        // Act
        var actionResult = await _controller.GetNotificationsPaginated(1, 10);


        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as PaginationWrapper<Notification>;

        // Assert
        Assert.IsType<OkObjectResult>(objectResult);
        Assert.IsAssignableFrom<PaginationWrapper<Notification>>(objectResultValue);
        Assert.NotNull(objectResultValue);
    }

    [Fact]
    public async Task ReadNotificationReturnsConflictResultWhenActorDoesNotMatchNotificationReceiver()
    {
        // Arrange
        var oid = "not123";
        A.CallTo(() => _notificationService.GetNotificationAsync(A<string>.Ignored))
            .Returns(new Notification("s", oid, "m", "type", 100));
        A.CallTo(() => _httpContextAccessor.HttpContext!.User.FindFirst(A<string>.Ignored))
            .Returns(new Claim("oid", oid));

        // Act
        var controller = GetControllerWithIodContext(oid);
        var actionResult = await controller.ReadNotification(oid);


        var objectResult = actionResult as ObjectResult;

        // Assert
        Assert.IsType<BadRequestObjectResult>(objectResult);
    }

    [Fact]
    public async Task ReadNotificationReturnsConflictResultWhenNotificationIsNull()
    {
        // Arrange
        Notification? notification = null;
        A.CallTo(() => _notificationService.GetNotificationAsync(A<string>.Ignored)).Returns(notification);

        // Act
        var controller = GetControllerWithIodContext("123");
        var actionResult = await controller.ReadNotification("123");


        var objectResult = actionResult as ObjectResult;

        // Assert
        Assert.IsType<ConflictObjectResult>(objectResult);
    }

    [Fact]
    public async Task DeleteNotificationReturnsConflictWhenActorIdIsNotEqualToReceiverId()
    {
        // Arrange
        var notification = new Notification("s", "r", "m", "type", 100);
        A.CallTo(() => _notificationService.GetNotificationAsync(A<string>.Ignored)).Returns(notification);
        A.CallTo(() => _notificationService.DeleteAsync(A<string>.Ignored)).Returns(true);

        // Act
        var controller = GetControllerWithIodContext("123");
        var actionResult = await controller.ReadNotification("123");


        var objectResult = actionResult as ObjectResult;

        // Assert
        Assert.IsType<ConflictObjectResult>(objectResult);
    }

    [Fact]
    public async Task DeleteNotificationReturnsConflictWhenNotificationIsNull()
    {
        // Arrange
        Notification? notification = null;
        A.CallTo(() => _notificationService.GetNotificationAsync(A<string>.Ignored)).Returns(notification);

        // Act
        var controller = GetControllerWithIodContext("123");
        var actionResult = await controller.ReadNotification("123");


        var objectResult = actionResult as ObjectResult;

        // Assert
        Assert.IsType<ConflictObjectResult>(objectResult);
    }


    private NotificationController GetControllerWithIodContext(string iod)
    {
        var mockController = new NotificationController(_notificationService, _httpContextAccessor)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            },
            HttpContext =
            {
                User = new ClaimsPrincipal()
            }
        };
        
        mockController.ActorId = iod;

        // adding claims
        var claims = new ClaimsIdentity();
        claims.AddClaim(new Claim(ClaimConstants.ObjectId, iod));
        mockController.HttpContext.User.AddIdentity(claims);

        return mockController;
    }
    
    [Fact]
    public async Task ReadNotification_Returns_Conflict_When_Notification_Is_Null()
    {
        // Arrange
        var id = "notification-id";
        var notificationService = A.Fake<INotificationService>();
        A.CallTo(() => notificationService.GetNotificationAsync(id)).Returns((Notification)null!);
        var controller = new NotificationController(notificationService, A.Fake<IHttpContextAccessor>());

        // Act
        var result = await controller.ReadNotification(id);

        // Assert
        Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal($"Notification {id}.", (result as ConflictObjectResult)?.Value);
    }
    
    [Fact]
    public async Task ReadNotification_Returns_Conflict_When_User_Is_Not_Receiver()
    {
        // Arrange
        var id = "notification-id";
        var receiverId = "receiver-id";
        var notificationService = A.Fake<INotificationService>();
        A.CallTo(() => notificationService.GetNotificationAsync(id)).Returns(new Notification("sender-id", receiverId, "message", "type", 100));
        var controller = GetControllerWithIodContext("not-receiver-id");
        controller.User.AddIdentity(new ClaimsIdentity(new[] { new Claim(ClaimConstants.ObjectId, receiverId) }));

        // Act
        var result = await controller.ReadNotification(id);

        // Assert
        Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal($"User not-receiver-id does not have access to modify notification {id}.", (result as ConflictObjectResult)?.Value);
    }

    [Fact]
    public async Task ReadNotification_Returns_Ok_When_Update_Read_Succeeds()
    {
        // Arrange
        var id = "notification-id";
        var receiverId = "receiver-id";
        A.CallTo(() => _notificationService.GetNotificationAsync(id)).Returns(new Notification("sender-id", receiverId, "message", "type", 100));
        A.CallTo(() => _notificationService.UpdateReadAsync(id)).Returns(true);
        var controller = GetControllerWithIodContext("receiver-id");
        controller.User.AddIdentity(new ClaimsIdentity(new[] { new Claim(ClaimConstants.ObjectId, receiverId) }));

        // Act
        var result = await controller.ReadNotification(id);

        // Assert
        Assert.IsType<OkResult>(result);
    }

    private static IEnumerable<Notification> GetTestNotifications()
    {
        return new[]
        {
            new Notification("Sender123", "Receiver123", "Test message 1", "Kudos", 100),
            new Notification("Sender12345", "Receiver123", "Test message 2", "Kudos", 100),
            new Notification("Sender1234567", "Receiver123", "Test message 3", "Kudos", 100),
            new Notification("Sender1236785", "Receiver123", "Test message 4", "Kudos", 100)
        };
    }

    private static PaginationWrapper<Notification> GetTestNotificationsPaginated()
    {
        return new PaginationWrapper<Notification>(GetTestNotifications(), 1, 10, 4);
    }
}