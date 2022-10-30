using API.Models.Posts;
using API.Utils;

namespace API.Repository.Interfaces;

public interface IPostRepository
{
    public Task<PostModel?> GetByIdAsync(Guid guid);
    public Task CreateAsync(PostModel postModel);
    public Task UpdateAsync(PostModel postModel);
    public Task DeleteAsync(PostModel postModel);
    Task<IEnumerable<PostModel>> GetAllAsync();
    Task<PaginationWrapper<PostModel>> GetAllByDatePaginatedAsync(int page, int pageCount);
}