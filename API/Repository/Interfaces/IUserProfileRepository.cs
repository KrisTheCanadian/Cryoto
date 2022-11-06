using API.Models.WorkDay;

namespace API.Repository.Interfaces;

public interface IUserProfileRepository


{
    public Task<List<UserProfileModel>> GetAllUsersAsync();
    public Task<List<UserProfileModel>> GetSearchResultAsync(string keywords);
    public Task<UserProfileModel?> GetUserProfileAsync(string oid);
    public Task<int> AddUserProfileAsync(UserProfileModel user);
    Task<UserProfileModel?> GetUserById(string userId);
}