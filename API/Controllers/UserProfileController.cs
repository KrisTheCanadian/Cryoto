using System.Security.Claims;
using API.Models.WorkDay;
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
    private readonly ICryptoService _cryptoService;
    private readonly ClaimsIdentity? _identity;
    private readonly string _oId;


    public UserProfileController(IUserProfileService userProfileService, ICryptoService cryptoService,
        IHttpContextAccessor contextAccessor)
    {
        _userProfileService = userProfileService;
        _cryptoService = cryptoService;
        _identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _oId = _identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserProfileModel>> GetUserById(string userId)
    {
        var user = await _userProfileService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return Conflict("User was not found.");
        }

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
        var userProfileModel = await _userProfileService.GetUserProfileService(_oId);
        if (userProfileModel != null) return Ok(userProfileModel);

        userProfileModel = await _userProfileService.AddUserProfileService(_identity);
        if (userProfileModel == null)
            return BadRequest("Could not create a new account");
        if (!await _cryptoService.CreateUserWallets(_oId))
            return BadRequest("Could not create user wallets");

        await _cryptoService.AddTokensAsync(100, _oId, "toAward");
        await _cryptoService.UpdateTokenBalance(100, _oId, "toAward");
        await _cryptoService.AddTokensAsync(100, _oId, "toSpend");
        await _cryptoService.UpdateTokenBalance(100, _oId, "toSpend");
        _cryptoService.QueueTokenUpdate(new List<string> { _oId, _oId });

        return Ok(userProfileModel);
    }
}