using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Hub;
using API.Models.Notifications;
using API.Repository.Interfaces;
using API.Services;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Xunit;

namespace API.Tests.ServicesTests;

public class NotificationServiceTests
{
    private readonly NotificationService _controller;
    private readonly INotificationRepository _repository;

    public NotificationServiceTests()
    {
        var configuration = A.Fake<IConfiguration>();
        var logger = A.Fake<ILogger<NotificationService>>();
        var userProfileRepository = A.Fake<IUserProfileRepository>();
        var hubContext = A.Fake<IHubContext<NotificationsHub>>();
        _repository = A.Fake<INotificationRepository>();
        _controller =
            new NotificationService(hubContext, _repository, logger, userProfileRepository, configuration);
    }

    [Fact]
    public async Task NotificationService_GetUserNotificationsAsync_ReturnsNotificationList()
    {
        //Arrange
        var notificationModel = GetNotificationModel();
        A.CallTo(() => _repository.GetUserNotificationsAsync(A<string>._))
            .Returns(notificationModel);

        //Act
        var actionResult = await _controller.GetUserNotificationsAsync("actorId");
        var notifications = actionResult.ToList();

        //Assert
        notifications.Should().NotBeNull();
        notifications.Should().BeOfType(typeof(List<Notification>));
    }

    [Fact]
    public async Task NotificationService_GetNotificationAsync_ReturnsNotification()
    {
        //Arrange
        var notificationModel = GetNotificationModel();
        A.CallTo(() => _repository.GetNotificationAsync(A<string>._))
            .Returns(notificationModel.Result.First());

        //Act
        var actionResult = await _controller.GetNotificationAsync("id");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(Notification));
    }

    [Fact]
    public async Task NotificationService_UpdateReadAsync_ReturnsTrue()
    {
        //Arrange
        A.CallTo(() => _repository.UpdateReadAsync(A<string>._))
            .Returns(true);

        //Act
        var actionResult = await _controller.UpdateReadAsync("id");

        //Assert
        actionResult.Should().BeTrue();
    }

    [Fact]
    public async Task NotificationService_DeleteAsync_ReturnsTrue()
    {
        //Arrange
        A.CallTo(() => _repository.DeleteAsync(A<string>._))
            .Returns(true);

        //Act
        var actionResult = await _controller.DeleteAsync("id");

        //Assert
        actionResult.Should().BeTrue();
    }

    private static Task<IEnumerable<Notification>> GetNotificationModel()
    {
        IEnumerable<Notification> notificationModel = new List<Notification>
        {
            new("senderId1", "receiverId1", "message1", "type1", 10),
            new("senderId2", "receiverId2", "message2", "type2", 20)
        };

        return Task.FromResult(notificationModel);
    }
}