using System.Security.Claims;
using API.Models.Users;

namespace API.Services.Interfaces;

public interface IUserProfileService
{
    public Task<List<UserProfileModel>> GetAllUsersService();
    public Task<List<UserProfileModel>> GetSearchResultServiceAsync(string keywords);
    public Task<UserProfileModel?> GetOrAddUserProfileService(string oid, ClaimsIdentity? user);
    Task<UserProfileModel?> GetUserByIdAsync(string userId);
}