using API.Models.Posts;
using API.Utils;

namespace API.Repository.Interfaces;

public interface IPostRepository
{
    public Task<PostModel?> GetByIdAsync(string guid);
    public Task<bool> CreateAsync(PostModel postModel);
    public Task<bool> UpdateAsync(PostModel postModel);
    public Task DeleteAsync(PostModel postModel);
    public Task<bool> DeleteAsyncById(string guid);
    Task<IEnumerable<PostModel>> GetAllAsync();
    Task<PaginationWrapper<PostModel>> GetAllByDatePaginatedAsync(int page, int pageCount, string oid = "oid");
    public Task<int> GetSentPostsCountAsync(string oid );
    public Task<int> GetReceivedPostsCountAsync(string oid);
    Task<bool> ReactAsync(int type, string guid, string actorId);
}