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
[Route("[controller]/[action]")]
public class UserProfileController : ControllerBase
{
    private readonly IUserProfileService _userProfileService;
    private readonly ClaimsIdentity? _identity;
    private readonly string _oId;


    public UserProfileController(IUserProfileService userProfileService, IHttpContextAccessor contextAccessor)
    {
        _userProfileService = userProfileService;
        _identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _oId = _identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserProfileModel>> GetUserById(string userId)
    {
        var user = await _userProfileService.GetUserByIdAsync(userId);
        if (user == null) return NotFound("User was not found.");
        return Ok(user);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<UserProfileModel>>> GetAllUsers()
    {
        return Ok(await _userProfileService.GetAllUsersService());
    }

    [HttpGet]
    public async Task<ActionResult<List<UserProfileModel>>> GetSearchResult(string keywords)
    {
        return Ok(await _userProfileService.GetSearchResultServiceAsync(keywords));
    }

    [HttpGet]
    public async Task<ActionResult<UserProfileModel>> GetUserProfile()
    {
        var userProfileModel = await _userProfileService.GetOrAddUserProfileService(_oId, _identity);
        if (userProfileModel == null)
            return BadRequest("Could not create a new account");
        return Ok(userProfileModel);
    }

    [ExcludeFromCodeCoverage]
    [HttpGet]
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
}