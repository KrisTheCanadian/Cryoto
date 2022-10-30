using API.Models.Posts;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using API.Utils;

namespace API.Services;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;
    public PostService(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }
    
    public async Task<PostModel?> GetByIdAsync(Guid guid)
    {
        return await _postRepository.GetByIdAsync(guid);
    }

    public async Task CreateAsync(PostModel postModel)
    {
        await _postRepository.CreateAsync(postModel);
    }

    public async Task UpdateAsync(PostModel postModel)
    {
        await _postRepository.UpdateAsync(postModel);
    }

    public async Task DeleteAsync(PostModel postModel)
    {
        await _postRepository.DeleteAsync(postModel);
    }

    public async Task<PaginationWrapper<PostModel>> GetUserFeedPaginatedAsync(string userId, int page, int pageCount)
    {
        // for now the algorithm will just get all posts and prioritize the post by date
        // in the future, the algorithm will be developed for more personalized feeds
        return await _postRepository.GetAllByDatePaginatedAsync(page, pageCount);
    }

    public async Task<IEnumerable<PostModel>> GetAllAsync()
    {
        return await _postRepository.GetAllAsync();
    }
}