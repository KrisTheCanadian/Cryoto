using System.Diagnostics.CodeAnalysis;
using System.Net.Http.Headers;
using System.Security.Claims;
using API.Models.Users;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;

namespace API.Controllers;

[Authorize]
[ApiController]
public class UserProfileController : ControllerBase
{
    private readonly ClaimsIdentity? _identity;
    private readonly string _oId;
    private readonly IUserProfileService _userProfileService;


    public UserProfileController(IUserProfileService userProfileService, IHttpContextAccessor contextAccessor)
    {
        _userProfileService = userProfileService;
        _identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _oId = _identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [Route("Admin/[controller]/[action]")]
    public async Task<ActionResult<UserProfileModel>> GetUserById(string userId)
    {
        var user = await _userProfileService.GetUserByIdAsync(userId);
        if (user == null) return NotFound("User was not found.");
        return Ok(user);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [Route("Admin/[controller]/[action]")]
    public async Task<ActionResult<List<UserProfileModel>>> GetAllUsers()
    {
        return Ok(await _userProfileService.GetAllUsersService());
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    [Route("Admin/[controller]/[action]")]
    public async Task<ActionResult<bool>> UpdateUserRoles(string[] roles, string oId)
    {
        return Ok(await _userProfileService.UpdateUserRolesService(oId, roles));
    }

    [HttpGet]
    [Route("[controller]/[action]")]
    public async Task<ActionResult<List<UserProfileModel>>> GetSearchResult(string? keywords)
    {
        return Ok(await _userProfileService.GetSearchResultServiceAsync(keywords, _oId));
    }

    [HttpGet]
    [Route("[controller]/[action]")]
    public async Task<ActionResult<UserProfileModel>> GetUserProfile()
    {
        var userProfileModel = await _userProfileService.GetOrAddUserProfileService(_oId, _identity);
        if (userProfileModel == null)
            return BadRequest("Could not create a new account");
        return Ok(userProfileModel);
    }

    [HttpPut]
    [Route("[controller]/[action]")]
    public async Task<ActionResult<UserProfileModel>> Update(UserProfileUpdateModel userProfileUpdateModel)
    {
        // validate received data
        if (
            userProfileUpdateModel.Name == null
            && userProfileUpdateModel.BusinessTitle == null
            && userProfileUpdateModel.Language == null
            && userProfileUpdateModel.Bio == null
            && userProfileUpdateModel.EmailNotifications == null
        )
            return BadRequest("No new data is provided.");

        // fetch user profile
        var userProfile = await _userProfileService.GetUserByIdAsync(_oId);
        if (userProfile == null) return Conflict("Cannot update the user profile because it does not exist.");

        // set new attributes 
        if (userProfileUpdateModel.Name != null) userProfile.Name = userProfileUpdateModel.Name;
        if (userProfileUpdateModel.BusinessTitle != null)
            userProfile.BusinessTitle = userProfileUpdateModel.BusinessTitle;
        if (userProfileUpdateModel.Language != null) userProfile.Language = userProfileUpdateModel.Language;
        if (userProfileUpdateModel.Bio != null) userProfile.Bio = userProfileUpdateModel.Bio;
        if (userProfileUpdateModel.EmailNotifications != null)
            userProfile.EmailNotifications = userProfileUpdateModel.EmailNotifications ?? false;

        // update record in the DB
        var updated = await _userProfileService.UpdateAsync(userProfile);
        if (!updated) return BadRequest("Could not update user profile.");

        // fetch updated user profile form the DB
        var updatedUserProfile = await _userProfileService.GetUserByIdAsync(_oId);

        return Ok(updatedUserProfile);
    }

    [ExcludeFromCodeCoverage]
    [HttpGet]
    [Route("[controller]/[action]")]
    public async Task<ActionResult<string>> GetUserProfilePhoto([FromHeader] string msGraphAccessToken,
        [FromHeader] string? userOId)
    {
        if (userOId == null) return "";
        var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", msGraphAccessToken);
        var response = await client.GetAsync($"https://graph.microsoft.com/v1.0/users/{userOId}/photo/$value");
        if (!response.IsSuccessStatusCode) return "";
        var res = await response.Content.ReadAsByteArrayAsync();
        return "data:image/jpeg;base64," + Convert.ToBase64String(res);
    }


    [HttpPut]
    [Authorize(Roles = "Admin")]
    [Route("Admin/[controller]/[action]")]
    public async Task<OkResult> UpdateUserProfileFakeData()
    {
        await _userProfileService.UpdateUserProfileFakeData();
        return Ok();
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    [Route("Admin/[controller]/[action]")]
    public async Task<OkResult> UpdateUserProfileRecognitionsCount()
    {
        await _userProfileService.UpdateUserProfilesRecognitionsCount();
        return Ok();
    }

    [HttpGet]
    [Route("[controller]/[action]")]
    public ActionResult<List<UserProfileModel>> GetUpcomingAnniversaries()
    {
        return Ok(_userProfileService.GetUpcomingAnniversaries());
    }

    [HttpGet]
    [Route("[controller]/[action]")]
    public ActionResult<List<TopRecognizers>> GetTopRecognizers()
    {
        return Ok(_userProfileService.GetTopRecognizers());
    }
}