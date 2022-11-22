using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Models.WorkDay;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.ControllersTests;

public class UserProfileControllerTests
{
    private readonly IUserProfileService _userProfileService;
    private readonly ICryptoService _cryptoService;
    private readonly ITransactionService _transactionService;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly UserProfileController _controller;

    public UserProfileControllerTests()
    {
        _cryptoService = A.Fake<ICryptoService>();
        _userProfileService = A.Fake<IUserProfileService>();
        _transactionService = A.Fake<ITransactionService>();
        _contextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new UserProfileController(_userProfileService, _cryptoService, _transactionService, _contextAccessor);
    }

    [Fact]
    public async void UserProfileController_GetAllUsers_ReturnOK()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        A.CallTo(() => _userProfileService.GetAllUsersService()).Returns(userProfileModelList);

        //Act
        var actionResult = await _controller.GetAllUsers();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as List<UserProfileModel>;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue.Should().HaveCount(2);
        objectResultValue?[0].OId.Should().Be(userProfileModelList.Result[0].OId);
    }


    [Fact]
    public async void UserProfileController_GetUserProfile_ReturnOK()
    {
        var userProfileController = new UserProfileController(_userProfileService, _cryptoService, _transactionService, _contextAccessor)
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
        A.CallTo(() => _userProfileService.GetUserProfileService(A<string>._)).Returns(userProfileModel);

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
    public async void UserProfileController_GetUserWithNonExistingAccount_ReturnOK()
    {
        //Arrange
        var userProfileModel = GetUserProfileModelList().Result[0];
        A.CallTo(() => _userProfileService.GetUserProfileService(A<string>._))!.Returns(
            Task.FromResult<UserProfileModel>(null!));
        A.CallTo(() => _userProfileService.AddUserProfileService(A<ClaimsIdentity>._)).Returns(userProfileModel);
        A.CallTo(() => _cryptoService.CreateUserWallets(A<string>._)).Returns(true);


        //Act
        var actionResult = await _controller.GetUserProfile();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserProfileModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(userProfileModel.OId);
        A.CallTo(() => _userProfileService.AddUserProfileService(A<ClaimsIdentity>._)).MustHaveHappened();
    }


    private Task<List<UserProfileModel>> GetUserProfileModelList()
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