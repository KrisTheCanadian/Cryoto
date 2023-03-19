using System.Threading.Tasks;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services;
using API.Services.Interfaces;
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
        A.CallTo(() => _postRepository.BoostAsync(A<string>._, A<string>._)).Returns(Task.FromResult(true));

        // Act
        var result = _postService.BoostAsync("123", actorProfile);

        // Assert
        result.Should().NotBeNull();
        Assert.False(result.Result);
    }
}