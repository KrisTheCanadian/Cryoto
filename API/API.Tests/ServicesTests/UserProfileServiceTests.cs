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
        A.CallTo(() => _context.GetSearchResultAsync(A<string>._, A<string>._)).Returns(userProfileModelList);

        //Act
        var actionResult = await _controller.GetSearchResultServiceAsync("keywords", "oid");

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

    [Fact]
    public async void UserProfileService_UpdateAsync_ReturnsTrue()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        var updatedUserProfile = new UserProfileModel("oid1", "name3", "email3", "lang3", new[] { "role3", "role4" });
        A.CallTo(() => _context.UpdateAsync(A<UserProfileModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _context.GetUserByIdAsync(A<string>._)).Returns(updatedUserProfile);

        //Act
        var actionResult = await _controller.UpdateAsync(updatedUserProfile);
        var actionResult2 = await _controller.GetUserByIdAsync("keywords");

        //Assert
        actionResult.Should().BeTrue();
        actionResult2.Should().NotBeNull();
        actionResult2.Should().BeOfType(typeof(UserProfileModel));
        actionResult2?.OId.Should().Be(updatedUserProfile.OId);
        actionResult2?.Name.Should().Be(updatedUserProfile.Name);
        actionResult2?.Email.Should().Be(updatedUserProfile.Email);
        actionResult2?.Language.Should().Be(updatedUserProfile.Language);
    }

    [Fact]
    public async void UserProfileService_UpdateUserRolesService_ReturnsTrue()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        A.CallTo(() => _context.GetUserByIdAsync(A<string>._)).Returns(userProfileModelList.Result[0]);
        A.CallTo(() => _context.UpdateUserProfile(A<UserProfileModel>._)).Returns(1);

        //Act
        var actionResult = await _controller.UpdateUserRolesService("oid", new[] { "role3", "role4" });

        //Assert
        actionResult.Should().BeTrue();
    }

    [Fact]
    public async void UserProfileService_GetUpcomingAnniversaries_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = await GetUserProfileModelList();
        A.CallTo(() => _context.GetUpcomingAnniversaries()).Returns(userProfileModelList);

        //Act
        var actionResult = _controller.GetUpcomingAnniversaries();

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<UserProfileModel>));
    }

    [Fact]
    public async void UserProfileService_GetTopRecognizers_ReturnsObjectList()
    {
        //Arrange
        var users = await GetUserProfileModelList();
        var recognizers = new List<TopRecognizers> { new(5, users[0]), new(2, users[1]) };
        A.CallTo(() => _context.GetTopRecognizers()).Returns(recognizers);

        //Act
        var actionResult = _controller.GetTopRecognizers();

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<TopRecognizers>));
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