using System.Security.Claims;
using API.Models.WorkDay;

namespace API.Services.Interfaces;

public interface IUserProfileService
{
    public Task<bool> SendEmail(string recipient);
    public Task<List<UserProfileModel>> GetAllUsersService();
    public Task<List<UserProfileModel>> GetSearchResultServiceAsync(string keywords);
    public Task<UserProfileModel?> GetUserProfileService(string oid);
    public Task<UserProfileModel?> AddUserProfileService(ClaimsIdentity? user);
    Task<UserProfileModel?> GetUserByIdAsync(string userId);
}