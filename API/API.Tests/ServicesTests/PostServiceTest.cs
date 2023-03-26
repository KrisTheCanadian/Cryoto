using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models.Posts;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services;
using API.Services.Interfaces;
using API.Tests.Utils;
using API.Utils;
using FakeItEasy;
using FluentAssertions;
using Xunit;

namespace API.Tests.ServicesTests;

public class PostServiceTest
{
    private readonly IPostRepository _postRepository;
    private readonly IPostService _postService;

    public PostServiceTest()
    {
        _postRepository = A.Fake<IPostRepository>();
        _postService = new PostService(_postRepository);
    }

    [Fact]
    public void BoostAsync_Partner_ReturnsTrue()
    {
        // Arrange
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new[] { "Partner" });
        A.CallTo(() => _postRepository.BoostAsync(A<string>._, A<string>._)).Returns(Task.FromResult(true));

        // Act
        var result = _postService.BoostAsync("123", actorProfile);

        // Assert
        result.Should().NotBeNull();
        Assert.True(result.Result);
    }

    [Fact]
    public void BoostAsync_SeniorPartner_ReturnsTrue()
    {
        // Arrange
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new[] { "Senior Partner" });
        A.CallTo(() => _postRepository.BoostAsync(A<string>._, A<string>._)).Returns(Task.FromResult(true));

        // Act
        var result = _postService.BoostAsync("123", actorProfile);

        // Assert
        result.Should().NotBeNull();
        Assert.True(result.Result);
    }

    [Fact]
    public void BoostAsync_ReturnsTrue()
    {
        // Arrange
        var actorProfile =
            new UserProfileModel("actorId", "name", "email", "en", new[] { "Senior Partner", "Partner" });
        A.CallTo(() => _postRepository.BoostAsync(A<string>._, A<string>._)).Returns(Task.FromResult(true));

        // Act
        var result = _postService.BoostAsync("123", actorProfile);

        // Assert
        result.Should().NotBeNull();
        Assert.True(result.Result);
    }

    [Fact]
    public void BoostAsync_ReturnsFalse()
    {
        // Arrange
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new[] { "role" });
        A.CallTo(() => _postRepository.BoostAsync(A<string>._, A<string>._)).Returns(Task.FromResult(false));

        // Act
        var result = _postService.BoostAsync("123", actorProfile);

        // Assert
        result.Should().NotBeNull();
        Assert.False(result.Result);
    }
    
    [Fact]
    public void UnboostAsync_ReturnsTrue()
    {
        // Arrange
        var actorProfile =
            new UserProfileModel("actorId", "name", "email", "en", new[] { "Senior Partner", "Partner" });
        A.CallTo(() => _postRepository.UnboostAsync(A<string>._, A<string>._)).Returns(Task.FromResult(true));

        // Act
        var result = _postService.UnboostAsync("123", actorProfile);

        // Assert
        result.Should().NotBeNull();
        Assert.True(result.Result);
    }

    [Fact]
    public void UnboostAsync_ReturnsFalse()
    {
        // Arrange
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new[] { "role" });
        A.CallTo(() => _postRepository.UnboostAsync(A<string>._, A<string>._)).Returns(Task.FromResult(false));

        // Act
        var result = _postService.UnboostAsync("123", actorProfile);

        // Assert
        result.Should().NotBeNull();
        Assert.False(result.Result);
    }
    
    [Fact]
    public async Task GetByIdAsync_ReturnsPost_WhenPostExists()
    {
        // Arrange
        var postId = "123";
        var expectedPost = new PostModelBuilder().BuildDefaultFakePost();
        A.CallTo(() => _postRepository.GetByIdAsync(postId)).Returns(expectedPost);

        // Act
        var result = await _postService.GetByIdAsync(postId);

        // Assert
        Assert.Equal(expectedPost, result);
    }
    
    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenPostDoesNotExist()
    {
        // Arrange
        var postId = "123";
        A.CallTo(() => _postRepository.GetByIdAsync(postId)).Returns((PostModel)null!);

        // Act
        var result = await _postService.GetByIdAsync(postId);

        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task CreateAsync_ReturnsTrue_WhenPostIsCreated()
    {
        // Arrange
        var postModel = new PostModelBuilder().BuildDefaultFakePost();
        
        A.CallTo(() => _postRepository.CreateAsync(A<PostModel>._)).Returns(true);

        // Act
        var result = await _postService.CreateAsync(postModel);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task UpdateAsync_ReturnsTrue_WhenPostIsUpdated()
    {
        // Arrange
        var postModel = new PostModelBuilder().BuildDefaultFakePost();
        A.CallTo(() => _postRepository.UpdateAsync(A<PostModel>._)).Returns(true);
        // Act
        var result = await _postService.UpdateAsync(postModel);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task DeleteByIdAsync_ReturnsTrue_WhenPostIsDeleted()
    {
        // Arrange
        var postId = "123";
        A.CallTo(() => _postRepository.DeleteAsyncById(A<string>._)).Returns(true);
        // Act
        var result = await _postService.DeleteByIdAsync(postId);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task GetUserFeedPaginatedAsync_ReturnsPaginationWrapper_WhenCalled()
    {
        // Arrange
        var expectedWrapper = new PaginationWrapper<PostModel>(new List<PostModel>(), 1, 1, 1);
        A.CallTo(() => _postRepository.GetAllByDatePaginatedAsync(A<int>._, A<int>._, A<string>._))
            .Returns(expectedWrapper);

        // Act
        var result = await _postService.GetUserFeedPaginatedAsync(1, 10);

        // Assert
        Assert.Equal(expectedWrapper, result);
    }
    
    [Fact]
    public async Task GetUserProfileFeedPaginatedAsync_ReturnsPaginationWrapper_WhenCalled()
    {
        // Arrange
        var expectedWrapper = new PaginationWrapper<PostModel>(new List<PostModel>(), 1, 1, 1);
        var userId = "123";
        A.CallTo(() => _postRepository.GetAllByDatePaginatedAsync(A<int>._, A<int>._, userId))
            .Returns(expectedWrapper);

        // Act
        var result = await _postService.GetUserProfileFeedPaginatedAsync(userId, 1, 10);

        // Assert
        Assert.Equal(expectedWrapper, result);
    }
    
    [Fact]
    public async Task ReactAsync_ReturnsTrue_WhenReactionIsSaved()
    {
        // Arrange
        var type = 1;
        var postId = "123";
        var actorId = "456";
        A.CallTo(() => _postRepository.ReactAsync(type, postId, actorId)).Returns(true);
        // Act
        var result = await _postService.ReactAsync(type, postId, actorId);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task DeleteByIdAsync_ReturnsFalse_WhenIdIsInvalid()
    {
        // Arrange
        var postId = "invalid-id";
        A.CallTo(() => _postRepository.DeleteAsyncById(postId)).Returns(false);

        // Act
        var result = await _postService.DeleteByIdAsync(postId);

        // Assert
        Assert.False(result);
    }
    
}