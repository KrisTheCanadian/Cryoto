using System.Security.Claims;
using API.Models.Notifications;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using Microsoft.Identity.Web;
using Newtonsoft.Json;

namespace API.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IUserProfileRepository _context;
    private readonly HttpClient _client = new HttpClient();

    public UserProfileService(IUserProfileRepository context)
    {
        _context = context;
    }

    public async Task<UserProfileModel?> GetOrAddUserProfileService(string oid, ClaimsIdentity? identity)
    {
        // Return userProfile if it is already exist.
        var userProfileModel = await _context.GetUserProfileAsync(oid);
        if (userProfileModel != null) return userProfileModel;

        // Create new userProfile if it does not exist.
        var uri = new Uri("https://my.api.mockaroo.com/workday.json?key=f8e15420");
        var mockarooResponse = await _client.GetStringAsync(uri);
        userProfileModel = JsonConvert.DeserializeObject<UserProfileModel>(mockarooResponse);

        userProfileModel!.OId = oid;
        userProfileModel.Name = identity?.FindFirst(ClaimConstants.Name)?.Value!;
        userProfileModel.Email = identity?.FindFirst(ClaimConstants.PreferredUserName)?.Value!;
        userProfileModel.Language = "en";
        userProfileModel.Roles = identity?.FindAll(ClaimConstants.Role).Select(x => x.Value).ToArray()!;
        
        if (await _context.AddUserProfileAsync(userProfileModel) <= 0) return null;

        return userProfileModel;
    }

    public async Task<List<UserProfileModel>> GetAllUsersService()
    {
        return await _context.GetAllUsersAsync();
    }

    public async Task<List<UserProfileModel>> GetSearchResultServiceAsync(string keywords)
    {
        return await _context.GetSearchResultAsync(keywords);
    }

    public async Task<UserProfileModel?> GetUserByIdAsync(string userId)
    {
        return await _context.GetUserByIdAsync(userId);
    }
}