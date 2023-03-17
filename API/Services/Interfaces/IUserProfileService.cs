using System.Security.Claims;
using API.Models.Users;

namespace API.Services.Interfaces;

public interface IUserProfileService
{
    public Task<List<UserWithBusinessTitleAndDateDto>?> GetSearchResultServiceAsync(string? keywords, string oid);
    public Task<bool> UpdateUserRolesService(string msGraphAccessToken, string oid, string[] roles);
    public Task<List<UserRolesModel>> GetAllUsersRolesServiceAsync(string msGraphAccessToken);
    public Task<UserProfileModel?> GetOrAddUserProfileService(string oid, ClaimsIdentity? user);
    Task<UserProfileModel?> GetUserByIdAsync(string userId);
    public Task UpdateUserProfileFakeData();
    public Task<bool> IncrementRecognitionsReceived(string oid);
    public Task<bool> IncrementRecognitionsSent(string oid);
    public Task<bool> UpdateAsync(UserProfileModel userProfileModel);
    public Task<List<UserWithBusinessTitleAndDateDto>> GetAnniversaryUsersAsync();
    public List<UserWithBusinessTitleAndDateDto> GetUpcomingAnniversaries();
    public List<TopRecognizers> GetTopRecognizers();
}