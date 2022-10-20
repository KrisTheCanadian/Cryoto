using API.Models;

namespace API.Repository.Interfaces;

public interface IUserProfileRepository


{
    public Task<List<UserProfileModel>> GetAllUsersAsync();
    public Task<UserProfileModel?> GetUserProfileAsync(string oid);
    public Task<int> AddUserProfileAsync(UserProfileModel user);
}