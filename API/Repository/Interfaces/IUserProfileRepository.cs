using API.Models.Users;

namespace API.Repository.Interfaces;

public interface IUserProfileRepository

{
    public Task<List<UserProfileModel>> GetAllUsersAsync();
    public Task<List<UserProfileModel>> GetSearchResultAsync(string keywords);
    public Task<UserProfileModel?> GetUserProfileAsync(string oid);
    public Task<int> AddUserProfileAsync(UserProfileModel user);
    public Task<bool> UpdateAsync(UserProfileModel userProfileModel);
    Task<UserProfileModel?> GetUserByIdAsync(string userId);
    public Task<int> UpdateUserProfile(UserProfileModel userProfile);
    public Task<List<UserProfileModel>> GetAnniversaryUsersAsync();
    public List<UserProfileModel> GetUpcomingAnniversaries();
    public List<TopRecognizers> GetTopRecognizers();
}