using API.Models.WorkDay;

namespace API.Services.Interfaces;

public interface IUserProfileService
{
    public Task<UserWorkdayModel?> GetUserWorkday();
    public UserProfileModel GetUserProfileDetails(string authorization);
    public Task AddUserProfile(UserProfileModel user);
    public void SendEmail(string recipient, string sender);
    public Task<List<UserProfileModel>> GetAllUsersService();
    public Task<UserProfileModel?> GetUserProfileService(string oid);
    public Task<int> AddUserProfileService(UserProfileModel user);
    Task<UserProfileModel?> GetUserByIdAsync(string userId);
}