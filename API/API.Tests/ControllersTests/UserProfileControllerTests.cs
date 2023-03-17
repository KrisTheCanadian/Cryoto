using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Models.Users;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.ControllersTests;

public class UserProfileControllerTests
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly UserProfileController _controller;
    private readonly IUserProfileService _userProfileService;

    public UserProfileControllerTests()
    {
        _userProfileService = A.Fake<IUserProfileService>();
        _contextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new UserProfileController(_userProfileService, _contextAccessor);
    }

    [Fact]
    public async void UserProfileController_GetUserById_ReturnsOK()
    {
        //Arrange
        var userProfileModel = GetUserProfileModelList().Result[0];
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._)).Returns(userProfileModel);

        //Act
        var actionResult = await _controller.GetUserById("oid");
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(userProfileModel.OId);
    }

    [Fact]
    public async void UserProfileController_GetUserById_ReturnsNotFound()
    {
        //Arrange
        UserProfileModel? userProfileModel = null;
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._)).Returns(userProfileModel);

        //Act
        var actionResult = await _controller.GetUserById("oid");
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(NotFoundObjectResult));
    }

    [Fact]
    public async void UserProfileController_GetAllUsersRoles_ReturnsOK()
    {
        //Arrange
        var userRolesModelList = GetUserRolesModelList();
        A.CallTo(() => _userProfileService.GetAllUsersRolesServiceAsync(A<string>._)).Returns(userRolesModelList);

        //Act
        var actionResult = await _controller.GetAllUsersRoles("token");
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as List<UserRolesModel>;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue.Should().HaveCount(2);
        objectResultValue?[0].OId.Should().Be(userRolesModelList.Result[0].OId);
    }


    [Fact]
    public async void UserProfileController_GetSearchResult_ReturnsOK()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        var userWithDateDtoList = userProfileModelList.Result.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();
        A.CallTo(() => _userProfileService.GetSearchResultServiceAsync(A<string>._, A<string>._))!
            .Returns(userWithDateDtoList);

        //Act
        var actionResult = await _controller.GetSearchResult("keywords");
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as List<UserWithBusinessTitleAndDateDto>;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue.Should().HaveCount(2);
        objectResultValue?[0].OId.Should().Be(userProfileModelList.Result[0].OId);
    }

    [Fact]
    public async void UserProfileController_GetUserProfile_ReturnsOK()
    {
        var userProfileController = new UserProfileController(_userProfileService, _contextAccessor)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            },
            HttpContext = { User = new ClaimsPrincipal() }
        };

        var claims = new ClaimsIdentity();
        claims.AddClaim(new Claim("oid", "oidValue"));
        claims.AddClaim(new Claim("name", "namValue"));
        claims.AddClaim(new Claim("preferred_username", "email"));
        claims.AddClaim(new Claim("roles", "Admin"));
        userProfileController.HttpContext.User.AddIdentity(claims);


        //Arrange
        var userProfileModel = GetUserProfileModelList().Result[0];
        A.CallTo(() => _userProfileService.GetOrAddUserProfileService(A<string>._, A<ClaimsIdentity>._))
            .Returns(userProfileModel);

        //Act
        var actionResult = await _controller.GetUserProfile();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(userProfileModel.OId);
    }

    [Fact]
    public async void UserProfileController_GetUpcomingAnniversaries_ReturnsOk()
    {
        //Arrange
        var userProfiles = await GetUserProfileModelList();
        var userWithDateDtos = userProfiles.Select(user => new UserWithBusinessTitleAndDateDto(user)).ToList();
        A.CallTo(() => _userProfileService.GetUpcomingAnniversaries())
            .Returns(userWithDateDtos);

        //Act
        var actionResult = _controller.GetUpcomingAnniversaries();
        var objectResult = actionResult.Result as ObjectResult;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async void UserProfileController_GetTopRecognizers_ReturnsOk()
    {
        //Arrange
        var users = await GetUserProfileModelList();
        var userWithDateDtos = users.Select(user => new UserWithBusinessTitleAndDateDto(user)).ToList();
        var recognizers = new List<TopRecognizers> { new(5, userWithDateDtos[0]), new(2, userWithDateDtos[1]) };
        A.CallTo(() => _userProfileService.GetTopRecognizers())
            .Returns(recognizers);

        //Act
        var actionResult = _controller.GetTopRecognizers();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as List<TopRecognizers>;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue.Should().Equal(recognizers);
    }

    [Fact]
    public async void UserProfileController_GetUserProfile_ReturnsBadRequest()
    {
        //Arrange
        UserProfileModel? userProfileModel = null;
        A.CallTo(() => _userProfileService.GetOrAddUserProfileService(A<string>._, A<ClaimsIdentity>._))
            .Returns(userProfileModel);

        //Act
        var actionResult = await _controller.GetUserProfile();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }

    [Fact]
    public async void UserProfileController_GetUserWithNonExistingAccount_ReturnsOK()
    {
        //Arrange
        var userProfileModel = GetUserProfileModelList().Result[0];
        A.CallTo(() => _userProfileService.GetOrAddUserProfileService(A<string>._, A<ClaimsIdentity>._))
            .Returns(userProfileModel);


        //Act
        var actionResult = await _controller.GetUserProfile();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(userProfileModel.OId);
        A.CallTo(() => _userProfileService.GetOrAddUserProfileService(A<string>._, A<ClaimsIdentity>._))
            .MustHaveHappened();
    }

    [Fact]
    public async void UserProfileController_Update_ReturnsBadRequest1()
    {
        //Arrange
        var nullUserProfileUpdateModel = new UserProfileUpdateModel(null, null, null, null, null);

        //Act
        var actionResult = await _controller.Update(nullUserProfileUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }

    [Fact]
    public async void UserProfileController_Update_ReturnsBadRequest2()
    {
        //Arrange
        var userProfileUpdateModel =
            new UserProfileUpdateModel("name", "business title", "lang", "bio", true);
        var userProfileModel =
            new UserProfileModel("oid1", "name1", "email1", "lang1", new[] { "roel1" });
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._))
            .Returns(userProfileModel);
        A.CallTo(() => _userProfileService.UpdateAsync(A<UserProfileModel>._))
            .Returns(Task.FromResult(false));

        //Act
        var actionResult = await _controller.Update(userProfileUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }

    [Fact]
    public async void UserProfileController_Update_ReturnsConflict()
    {
        //Arrange
        var userProfileUpdateModel =
            new UserProfileUpdateModel("name", "business title", "lang", "bio", true);
        UserProfileModel? nullUserProfileModel = null;
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._))
            .Returns(nullUserProfileModel);

        //Act
        var actionResult = await _controller.Update(userProfileUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(ConflictObjectResult));
    }

    [Fact]
    public async void UserProfileController_Update_ReturnsOk()
    {
        //Arrange
        var userProfileUpdateModel =
            new UserProfileUpdateModel("name", "business title", "lang", "bio", true);
        var userProfileModel =
            new UserProfileModel("oid1", "name1", "email1", "lang1", new[] { "roel1" });
        var updatedUserProfileModel = new UserProfileModel("oid1", "name1", "email1",
            userProfileUpdateModel.Language ?? "", new[] { "roel1" });
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._))
            .ReturnsNextFromSequence(userProfileModel, updatedUserProfileModel);
        A.CallTo(() => _userProfileService.UpdateAsync(A<UserProfileModel>._))
            .Returns(Task.FromResult(true));

        //Act
        var actionResult = await _controller.Update(userProfileUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.Language.Should().Be(updatedUserProfileModel.Language);
    }

    [Fact]
    public async void UserProfileController_Update_ReturnsOK()
    {
        //Arrange
        A.CallTo(() => _userProfileService.UpdateUserRolesService(A<string>._, A<string>._, A<string[]>._))
            .Returns(true);

        //Act
        var actionResult = await _controller.UpdateUserRoles("token", new[] { "role3", "role4" }, "oid");
        var objectResult = actionResult.Result as ObjectResult;

        //Assert
        actionResult.Should().NotBeNull();
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

    private static Task<List<UserRolesModel>> GetUserRolesModelList()
    {
        var roles1 = new List<string> { "roles1" };
        var roles2 = new List<string> { "roles1" };
        var userProfileModelList = new List<UserRolesModel>
        {
            new("oid1", "name1", roles1),
            new("oid2", "name2", roles2)
        };
        return Task.FromResult(userProfileModelList);
    }
    
    private static Task<List<UserDto>> GetUserProfileMiniModelList()
    {
        var userProfileModelList = new List<UserDto>
        {
            new("oid1", "name1"),
            new("oid2", "name2")
        };
        return Task.FromResult(userProfileModelList);
    }
}