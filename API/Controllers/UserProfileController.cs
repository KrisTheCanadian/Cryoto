using API.Models;
using API.Services.Interfaces.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly IUserProfileService _userProfileService;

    public UserProfileController(IUserProfileService userProfileService)
    {
        _userProfileService = userProfileService;
    }

    [HttpGet("/userProfile/all", Name = "GetAllUsersController")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<UserProfileModel>>> GetAllUsers()
    {
        return Ok(await _userProfileService.GetAllUsersService());
    }

    [HttpGet("/userProfile", Name = "GetUserProfileController")]
    public async Task<ActionResult<UserWorkdayModel>> GetUserProfile([FromHeader] string authorization)
    {
        var userWorkday = _userProfileService.GetUserWorkday().Result;
        var userDetails = _userProfileService.GetUserProfileDetails(authorization);
        var user = await _userProfileService.GetUserProfileService(userDetails.OId);
        if (user != null)
        {
            userWorkday.UserProfile = user;
            return Ok(userWorkday);
        }
        else
        {
            var numberOfLinesChanged = await _userProfileService.AddUserProfileService(userDetails);
            userWorkday.UserProfile = userDetails;
            return Ok(userWorkday);
        }
    }
}