using API.Models.Posts;
using API.Utils;

namespace API.Services.Interfaces;

public interface IPostService
{
    public Task<PostModel?> GetByIdAsync(string guid);
    public Task<bool> CreateAsync(PostModel postModel);
    public Task<bool> UpdateAsync(PostModel postModel);
    public Task DeleteAsync(PostModel postModel);
    public Task<bool> DeleteByIdAsync(string guid);
    public Task<PaginationWrapper<PostModel>> GetUserFeedPaginatedAsync(string userId, int page, int pageCount);
    public Task<IEnumerable<PostModel>> GetAllAsync();
}