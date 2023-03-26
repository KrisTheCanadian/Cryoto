using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services;
using API.Services.Interfaces;
using API.Tests.Utils;
using FakeItEasy;
using FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace API.Tests.ServicesTests;

public class UserProfileServicesTests
{
    private readonly IUserProfileRepository _context;
    private readonly UserProfileService _service;
    private readonly IMsGraphApiService _msGraphApiService;


    public UserProfileServicesTests()
    {
        _context = A.Fake<IUserProfileRepository>();
        _msGraphApiService = A.Fake<IMsGraphApiService>();
        _service = new UserProfileService(_context, _msGraphApiService);
    }

    [Fact]
    public async Task UserProfileService_GetAllUsersRolesDbServiceAsync_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        A.CallTo(() => _context.GetAllUsersAsync()).Returns(userProfileModelList);

        //Act
        var actionResult = await _service.GetAllUsersRolesDbServiceAsync();

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<UserRolesModel>));
        actionResult[0].OId.Should().Be(userProfileModelList.Result[0].OId);
    }

    [Fact]
    public async Task UserProfileService_GetSearchResultServiceAsync_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        var userWithDateDtoList =
            userProfileModelList.Result.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();
        A.CallTo(() => _context.GetSearchResultAsync(A<string>._, A<string>._)).Returns(userWithDateDtoList);

        //Act
        var actionResult = await _service.GetSearchResultServiceAsync("keywords", "oid");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<UserWithBusinessTitleAndDateDto>));
        actionResult?[0].OId.Should().Be(userProfileModelList.Result[0].OId);
    }

    [Fact]
    public async Task UserProfileService_GetUserByIdAsync_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        A.CallTo(() => _context.GetUserByIdAsync(A<string>._)).Returns(userProfileModelList.Result[0]);

        //Act
        var actionResult = await _service.GetUserByIdAsync("keywords");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(UserProfileModel));
        actionResult?.OId.Should().Be(userProfileModelList.Result[0].OId);
    }

    [Fact]
    public async Task UserProfileService_UpdateAsync_ReturnsTrue()
    {
        //Arrange
        var updatedUserProfile = new UserProfileModel("oid1", "name3", "email3", "lang3", new[] { "role3", "role4" });
        A.CallTo(() => _context.UpdateAsync(A<UserProfileModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _context.GetUserByIdAsync(A<string>._)).Returns(updatedUserProfile);

        //Act
        var actionResult = await _service.UpdateAsync(updatedUserProfile);
        var actionResult2 = await _service.GetUserByIdAsync("keywords");

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
    public async Task UserProfileService_UpdateUserRolesService_ReturnsTrue()
    {
        // Arrange
        const string msGraphAccessToken = "testToken";
        const string oid = "testOid";
        var newRoles = new[] { "role1", "role2" };
        var updatedRoles = new[] { "role1", "role2" };
        var userList = await GetUserProfileModelList();
        var userProfileModel = userList[0];

        A.CallTo(() => _context.GetUserByIdAsync(oid)).Returns(userProfileModel);
        A.CallTo(() => _msGraphApiService.AddRolesAzureAsync(A<string>._, A<string>._, A<string[]>._)).Returns(true);
        A.CallTo(() => _msGraphApiService.RemoveRolesAzureAsync(A<string>._, A<string>._, A<string[]>._)).Returns(true);
        A.CallTo(() => _context.UpdateUserProfile(A<UserProfileModel>._)).Returns(1);

        // Act
        var result = await _service.UpdateUserRolesService(msGraphAccessToken, oid, newRoles);

        // Assert
        result.Should().BeTrue();
        userProfileModel.Roles.Should().BeEquivalentTo(updatedRoles);
    }

    [Fact]
    public async Task UserProfileService_GetAllUsersRolesServiceAsync_ReturnsTrue()
    {
        // Arrange
        const string msGraphAccessToken = "testToken";
        var userRolesModelList = GetUserRolesModelList();
        var userList = await GetUserProfileModelList();

        A.CallTo(() => _context.GetAllUsersAsync()).Returns(userList);
        A.CallTo(() => _msGraphApiService.GetAzureUserRolesAsync(A<string>._, A<string>._))
            .Returns((List<string>?)null!);

        // Act
        var actionResult = await _service.GetAllUsersRolesServiceAsync(msGraphAccessToken);

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<UserRolesModel>));
        actionResult[0].OId.Should().Be(userRolesModelList[0].OId);
    }

    [Fact]
    public async Task UserProfileService_GetUpcomingAnniversaries_ReturnsUserProfileModelList()
    {
        //Arrange
        var userProfileModelList = await GetUserProfileModelList();
        var userWithDateDtos = userProfileModelList.Select(user => new UserWithBusinessTitleAndDateDto(user)).ToList();
        A.CallTo(() => _context.GetUpcomingAnniversaries()).Returns(userWithDateDtos);

        //Act
        var actionResult = _service.GetUpcomingAnniversaries();

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<UserWithBusinessTitleAndDateDto>));
    }

    [Fact]
    public async Task UserProfileService_GetTopRecognizers_ReturnsObjectList()
    {
        //Arrange
        var users = await GetUserProfileModelList();
        var userWithDateDtos = users.Select(user => new UserWithBusinessTitleAndDateDto(user)).ToList();
        var recognizers = new List<TopRecognizers> { new(5, userWithDateDtos[0]), new(2, userWithDateDtos[1]) };
        A.CallTo(() => _context.GetTopRecognizers()).Returns(recognizers);

        //Act
        var actionResult = _service.GetTopRecognizers();

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<TopRecognizers>));
    }
    
    [Fact]
    public async Task UpdateUserProfileFakeData_ShouldUpdateAllUsers()
    {
        // Arrange
        var users = new List<UserProfileModel>
        {
            new("1", "John", "john@example.com", "en-US", new[] { "user" }),
            new("2", "Jane", "jane@example.com", "en-US", new[] { "user" })
        };

        var uri = new Uri("https://my.api.mockaroo.com/workday100.json?key=c4fdbe70");
        var mockarooResponse = JsonConvert.SerializeObject(new List<UserProfileModel>
        {
            new("1", "John", "john@example.com", "en-US", new[] { "user" })
            {
                Company = "ABC Inc.",
                BusinessTitle = "Developer"
            },
            new("2", "Jane", "jane@example.com", "en-US", new[] { "user" })
            {
                Company = "XYZ Ltd.",
                BusinessTitle = "Engineer"
            }
        });

        // Act
        await _service.UpdateUserProfileFakeData();
    }
    
    [Fact]
    public async Task IncrementRecognitionsSent_ShouldReturnTrue_WhenUserProfileExists()
    {
        // Arrange
        var oid = "some-oid";
        var userProfileModel = new UserProfileModelBuilder().BuildDefaultFakeUserProfile();
        
        A.CallTo(() => _context.GetUserByIdAsync(oid)).Returns(userProfileModel);
        A.CallTo(() => _context.UpdateUserProfile(A<UserProfileModel>._)).Returns(1);

        // Act
        var result = await _service.IncrementRecognitionsSent(oid);

        // Assert
        Assert.True(result);
        Assert.Equal(1, userProfileModel.RecognitionsSent);
    }
    
    [Fact]
    public async Task IncrementRecognitionsSent_ShouldReturnFalse_WhenUserProfileDoesNotExist()
    {
        // Arrange
        var oid = "some-oid";
        
        A.CallTo(() => _context.GetUserByIdAsync(oid)).Returns((UserProfileModel)null!);

        // Act
        var result = await _service.IncrementRecognitionsSent(oid);

        // Assert
        Assert.False(result);
    }
    
    [Fact]
    public async Task IncrementRecognitionsReceived_ShouldReturnTrue_WhenUserProfileExists()
    {
        // Arrange
        var oid = "some-oid";
        var userProfileModel = new UserProfileModelBuilder().BuildDefaultFakeUserProfile();
        
        A.CallTo(() => _context.GetUserByIdAsync(oid)).Returns(userProfileModel);
        A.CallTo(() => _context.UpdateUserProfile(A<UserProfileModel>._)).Returns(1);

        // Act
        var result = await _service.IncrementRecognitionsReceived(oid);

        // Assert
        Assert.True(result);
        Assert.Equal(0, userProfileModel.RecognitionsSent);
    }
    
    [Fact]
    public async Task IncrementRecognitionsReceived_ShouldReturnFalse_WhenUserProfileDoesNotExist()
    {
        // Arrange
        var oid = "some-oid";
        
        A.CallTo(() => _context.GetUserByIdAsync(oid)).Returns((UserProfileModel)null!);

        // Act
        var result = await _service.IncrementRecognitionsReceived(oid);

        // Assert
        Assert.False(result);
    }
    
    [Fact]
    public async Task GetAnniversaryUsersAsync_ReturnsList()
    {
        // Arrange
        var fakeUsers = new List<UserWithBusinessTitleAndDateDto>
        {
            new(new UserProfileModelBuilder().BuildDefaultFakeUserProfile()),
            new(new UserProfileModelBuilder().BuildDefaultFakeUserProfile())
        };
        
        A.CallTo(() => _context.GetAnniversaryUsersAsync()).Returns(fakeUsers);
        

        // Act
        var result = await _service.GetAnniversaryUsersAsync();

        // Assert
        Assert.IsType<List<UserWithBusinessTitleAndDateDto>>(result);
        Assert.Equal(fakeUsers.Count, result.Count);
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

    private static List<UserRolesModel> GetUserRolesModelList()
    {
        var roles1 = new List<string> { "roles1" };
        var roles2 = new List<string> { "roles1" };
        var userProfileModelList = new List<UserRolesModel>
        {
            new("oid1", "name1", roles1),
            new("oid2", "name2", roles2)
        };
        return userProfileModelList;
    }
}