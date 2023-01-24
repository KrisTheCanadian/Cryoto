using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services;
using FakeItEasy;
using FluentAssertions;
using Xunit;

namespace API.Tests.ServicesTests;

public class UserProfileServicesTests
{
    private readonly IUserProfileRepository _context;
    private readonly UserProfileService _controller;


    public UserProfileServicesTests()
    {
        _context = A.Fake<IUserProfileRepository>();
        var postContext = A.Fake<IPostRepository>();
        _controller = new UserProfileService(_context, postContext);
    }

    [Fact]
    public async void UserProfileService_GetAllUsersService_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        A.CallTo(() => _context.GetAllUsersAsync()).Returns(userProfileModelList);

        //Act
        var actionResult = await _controller.GetAllUsersService();

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<UserProfileModel>));
        actionResult[0].OId.Should().Be(userProfileModelList.Result[0].OId);
    }

    [Fact]
    public async void UserProfileService_GetSearchResultServiceAsync_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        A.CallTo(() => _context.GetSearchResultAsync(A<string>._)).Returns(userProfileModelList);

        //Act
        var actionResult = await _controller.GetSearchResultServiceAsync("keywords");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<UserProfileModel>));
        actionResult[0].OId.Should().Be(userProfileModelList.Result[0].OId);
    }

    [Fact]
    public async void UserProfileService_GetUserByIdAsync_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        A.CallTo(() => _context.GetUserByIdAsync(A<string>._)).Returns(userProfileModelList.Result[0]);

        //Act
        var actionResult = await _controller.GetUserByIdAsync("keywords");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(UserProfileModel));
        actionResult?.OId.Should().Be(userProfileModelList.Result[0].OId);
    }

    private static Task<List<UserProfileModel>> GetUserProfileModelList()
    {
        var roles1 = new[] { "roles1" };
        var roles2 = new[] { "roles1" };
        var userProfileModelList = new List<UserProfileModel>
        {
            new("oid1", "name1", "email1", "en1", roles1),
            new("oid2", "name2", "email2", "en2", roles2)
        };
        return Task.FromResult(userProfileModelList);
    }
}