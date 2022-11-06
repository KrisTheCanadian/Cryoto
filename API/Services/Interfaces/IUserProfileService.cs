using API.Models.WorkDay;

namespace API.Services.Interfaces;

public interface IUserProfileService
{
    public Task<UserWorkdayModel?> GetUserWorkday();
    public UserProfileModel GetUserProfileDetails(string authorization);
    public Task AddUserProfile(UserProfileModel user);
    public Task SendEmail(string recipient);
    public Task<List<UserProfileModel>> GetAllUsersService();
    public Task<List<UserProfileModel>> GetSearchResultServiceAsync(string keywords);
    public Task<UserProfileModel?> GetUserProfileService(string oid);
    public Task<bool> AddUserProfileService(UserProfileModel user);
    Task<UserProfileModel?> GetUserByIdAsync(string userId);
}