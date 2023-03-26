using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using API.Hub;
using API.Models.Notifications;
using API.Models.Posts;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services;
using API.Tests.Utils;
using API.Utils;
using Azure;
using Azure.Communication.Email;
using Azure.Communication.Email.Models;
using Azure.Core;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Xunit;

namespace API.Tests.ServicesTests;

public class NotificationServiceTests
{
    private readonly NotificationService _service;
    private readonly INotificationRepository _repository;
    private readonly IHubContext<NotificationsHub> _hubContext;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IConfiguration _configuration;

    public NotificationServiceTests()
    {
        _configuration = A.Fake<IConfiguration>();
        var logger = A.Fake<ILogger<NotificationService>>();
        _userProfileRepository = A.Fake<IUserProfileRepository>();
        _hubContext = A.Fake<IHubContext<NotificationsHub>>();
        _repository = A.Fake<INotificationRepository>();
        _configuration["CryotoCommunicationsServiceConnectionString"] = "endpoint=https://endpoint;accesskey=accesskey";
        _service =
            new NotificationService(_hubContext, _repository, logger, _userProfileRepository, _configuration);
    }

    [Fact]
    public async Task NotificationService_GetUserNotificationsAsync_ReturnsNotificationList()
    {
        //Arrange
        var notificationModel = GetNotificationModel();
        A.CallTo(() => _repository.GetUserNotificationsAsync(A<string>._))
            .Returns(notificationModel);

        //Act
        var actionResult = await _service.GetUserNotificationsAsync("actorId");
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
        var actionResult = await _service.GetNotificationAsync("id");

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
        var actionResult = await _service.UpdateReadAsync("id");

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
        var actionResult = await _service.DeleteAsync("id");

        //Assert
        actionResult.Should().BeTrue();
    }
    
    [Fact]
    public async Task SendReactionNotification_ForHearts_ShouldSendNotificationAndEmailToPostAuthorAndPostRecipients()
    {
        // Arrange
        var actorId = "actor123";
        var type = 0;
        var post = new PostModelBuilder().BuildDefaultFakePost();
        post.Hearts = new[] { actorId };
        var user = new UserProfileModelBuilder().BuildDefaultFakeUserProfile();
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(actorId)).Returns(user);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(post.Author)).Returns(user);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync("recipient123")).Returns(user);

        // Act
        var result = await _service.SendReactionNotification(actorId, type, post);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task SendReactionNotification_ForClaps_ShouldSendNotificationAndEmailToPostAuthorAndPostRecipients()
    {
        // Arrange
        var actorId = "actor123";
        var type = 0;
        var post = new PostModelBuilder().BuildDefaultFakePost();
        post.Claps = new[] { actorId };
        var user = new UserProfileModelBuilder().BuildDefaultFakeUserProfile();
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(actorId)).Returns(user);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(post.Author)).Returns(user);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync("recipient123")).Returns(user);

        // Act
        var result = await _service.SendReactionNotification(actorId, type, post);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task SendReactionNotification_ForCelebrations_ShouldSendNotificationAndEmailToPostAuthorAndPostRecipients()
    {
        // Arrange
        var actorId = "actor123";
        var type = 0;
        var post = new PostModelBuilder().BuildDefaultFakePost();
        post.Celebrations = new[] { actorId };
        var user = new UserProfileModelBuilder().BuildDefaultFakeUserProfile();
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(actorId)).Returns(user);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(post.Author)).Returns(user);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync("recipient123")).Returns(user);

        // Act
        var result = await _service.SendReactionNotification(actorId, type, post);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task GetNotificationsPaginatedAsync_ReturnsPaginationWrapperOfNotifications()
    {
        // Arrange
        int page = 1;
        int pageSize = 10;
        int totalPages = 2;
        string actorId = "actorId";
        var expectedNotifications = new List<Notification> { new("sender", actorId, "test1", "general", 0), new("sender", actorId, "test2", "kudos", 5) };
        var paginationWrapper = new PaginationWrapper<Notification>(expectedNotifications, page, pageSize, totalPages);
        A.CallTo(() => _repository.GetNotificationsPaginatedAsync(actorId, page, pageSize))
            .Returns(Task.FromResult(paginationWrapper));

        // Act
        var result = await _service.GetNotificationsPaginatedAsync(actorId, page, pageSize);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(page, result.Page);
        Assert.Equal(pageSize, result.ItemsPerPage);
        Assert.Equal(totalPages, result.TotalPages);
        Assert.Equal(expectedNotifications, result.Data);
    }
    
    [Fact]
    public async Task SendCommentNotification_ShouldReturnTrue_WhenAllNotificationsAreSent()
    {
        // Arrange
        var actorId = "actor1";
        var postId = "post1";
        var postAuthorId = "author1";
        var postRecipient1Id = "recipient1";
        var postRecipient2Id = "recipient2";

        var commentAuthor = new UserProfileModel("commentAuthor1", "Comment Author", "comment.author@example.com", "en", new string[] { "user" });
        var postAuthor = new UserProfileModel(postAuthorId, "Post Author", "post.author@example.com", "en", new string[] { "user" });
        var postRecipient1 = new UserProfileModel(postRecipient1Id, "Post Recipient 1", "post.recipient1@example.com", "en", new string[] { "user" });
        var postRecipient2 = new UserProfileModel(postRecipient2Id, "Post Recipient 2", "post.recipient2@example.com", "en", new string[] { "user" });

        var post = new PostModelBuilder().BuildDefaultFakePost();
        var authorProfile = new UserProfileModelBuilder().BuildDefaultFakeUserProfile();
        
        post.Author = postAuthorId;
        post.AuthorProfile = new UserDto(authorProfile);

        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(actorId)).Returns(commentAuthor);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(postAuthorId)).Returns(postAuthor);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(postRecipient1Id)).Returns(postRecipient1);
        A.CallTo(() => _userProfileRepository.GetUserByIdAsync(postRecipient2Id)).Returns(postRecipient2);

        // Act
        var result = await _service.SendCommentNotification(actorId, postId, post);

        // Assert
        Assert.True(result);
    }
    
            [Fact]
        public async Task SendBoostNotification_Should_Send_Notification_To_Post_Author()
        {
            // Arrange
            var actorId = "actorId";
            var postAuthorId = "postAuthorId";
            var postRecipientId = "postRecipientId";
            var post = new PostModelBuilder()
                .WithId("postId")
                .WithAuthor(postAuthorId)
                .WithRecipientProfiles(new[]
                {
                    new UserDto(new UserProfileModelBuilder()
                        .WithId(postRecipientId)
                        .Build())
                })
                .Build();
            var actorProfile = new UserProfileModelBuilder()
                .WithId(actorId)
                .Build();

            post.AuthorProfile = new UserDto(actorProfile);
            
            // Act
            var result = await _service.SendBoostNotification(actorId, post);
            
            // Assert
            Assert.True(result);
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