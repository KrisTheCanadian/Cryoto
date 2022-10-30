using API.Models.Posts;
using API.Utils;

namespace API.Services.Interfaces;

public interface IPostService
{
    public Task<PostModel?> GetByIdAsync(Guid guid);
    public Task CreateAsync(PostModel postModel);
    public Task UpdateAsync(PostModel postModel);
    public Task DeleteAsync(PostModel postModel);
    public Task<PaginationWrapper<PostModel>> GetUserFeedPaginatedAsync(string userId, int page, int pageCount);
    public Task<IEnumerable<PostModel>> GetAllAsync();
}