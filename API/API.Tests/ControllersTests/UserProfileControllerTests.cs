using System;
using System.Collections.Generic;
using System.Security.Claims;
using API.Controllers;
using API.Models;
using API.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.Services.Interfaces.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Any;
using Xunit;

namespace API.Tests.Controllers;

public class UserProfileControllerTests
{
    private readonly IUserProfileService _userProfileService;
    private readonly UserProfileController _controller;

    public UserProfileControllerTests()
    {
        _userProfileService = A.Fake<IUserProfileService>();
        _controller = new UserProfileController(_userProfileService);
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
        var userProfileController = new UserProfileController(_userProfileService)
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
        var userWorkdayModel = GetUserWorkdayModel();
        A.CallTo(() => _userProfileService.GetUserWorkday()).Returns(userWorkdayModel);
        A.CallTo(() => _userProfileService.GetUserProfileDetails(A<string>._)).Returns(userProfileModel);
        A.CallTo(() => _userProfileService.GetUserProfileService(A<string>._)).Returns(userProfileModel);


        //Act
        var actionResult = await _controller.GetUserProfile("authorization");
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserWorkdayModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.UserProfile?.OId.Should().Be(userProfileModel.OId);
    }


    [Fact]
    public async void UserProfileController_GetAllUsersWithNonExistingAccount_ReturnOK()
    {
        //Arrange
        var userProfileModel = GetUserProfileModelList().Result[0];
        var userWorkdayModel = GetUserWorkdayModel();
        A.CallTo(() => _userProfileService.GetUserWorkday()).Returns(userWorkdayModel);
        A.CallTo(() => _userProfileService.GetUserProfileDetails(A<string>._)).Returns(userProfileModel);
        A.CallTo(() => _userProfileService.GetUserProfileService(A<string>._))!.Returns(
            Task.FromResult<UserProfileModel>(null!));
        A.CallTo(() => _userProfileService.AddUserProfileService(userProfileModel)).Returns(1);


        //Act
        var actionResult = await _controller.GetUserProfile("authorization");
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as UserWorkdayModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.UserProfile?.OId.Should().Be(userProfileModel.OId);
        A.CallTo(() => _userProfileService.AddUserProfileService(userProfileModel)).MustHaveHappened();
    }


    private Task<List<UserProfileModel>> GetUserProfileModelList()
    {
        List<UserProfileModel> userProfileModelList = new List<UserProfileModel>
        {
            new UserProfileModel("oid1", "name1", "email1", "en1", "roles1"),
            new UserProfileModel("oid2", "name2", "email2", "en2", "roles2")
        };
        return Task.FromResult(userProfileModelList);
    }

    private Task<UserWorkdayModel> GetUserWorkdayModel()
    {
        UserWorkdayModel userWorkdayModel = new UserWorkdayModel()
        {
            WorkerId = "d62c93f6-a9f6-468d-84b9-0493e487fc20",
            PreferredNameData = "Corissa Coronas",
            FirstName = "null",
            LastName = "null",
            Company = "Vidoo",
            SupervisoryOrganization = "Product Management",
            ManagerReference = "Corissa Coronas",
            CountryReference = "TH",
            CountryReferenceTwoLetter = "Marketing",
            PostalCode = "27120",
            PrimaryWorkTelephone = "(761) 4904571",
            Fax = "+86-153-402-8259",
            Mobile = "+382 (624) 518-5936",
            LocalReference = "Estonian",
            UserProfile = null
        };
        return Task.FromResult(userWorkdayModel);
    }
}