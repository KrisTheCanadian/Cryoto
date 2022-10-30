using API.Models.WorkDay;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class UserProfileController : ControllerBase
{
    private readonly IUserProfileService _userProfileService;

    public UserProfileController(IUserProfileService userProfileService)
    {
        _userProfileService = userProfileService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserProfileModel>> GetUserById(string userId)
    {
        var user = await _userProfileService.GetUserByIdAsync(userId);
        if (user == null) { return Conflict("User was not found."); }

        return Ok(user);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<UserProfileModel>>> GetAllUsers()
    {
        return Ok(await _userProfileService.GetAllUsersService());
    }

    [HttpGet]
    public async Task<ActionResult<UserWorkdayModel>> GetUserProfile([FromHeader] string authorization)
    {
        var userWorkday = _userProfileService.GetUserWorkday().Result;
        var userDetails = _userProfileService.GetUserProfileDetails(authorization);
        var user = await _userProfileService.GetUserProfileService(userDetails.OId);
        if (user != null)
        {
            userWorkday!.UserProfile = user;
            return Ok(userWorkday);
        }
        else
        {
            var numberOfLinesChanged = await _userProfileService.AddUserProfileService(userDetails);
            userWorkday!.UserProfile = userDetails;
            return Ok(userWorkday);
        }
    }
}