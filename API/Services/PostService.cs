using API.Models.Comments;
using API.Models.Posts;
using API.Models.Users;
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

    public async Task<PostModel?> GetByIdAsync(string guid)
    {
        return await _postRepository.GetByIdAsync(guid);
    }

    public async Task<bool> CreateAsync(PostModel postModel)
    {
        return await _postRepository.CreateAsync(postModel);
    }

    public async Task<bool> UpdateAsync(PostModel postModel)
    {
        return await _postRepository.UpdateAsync(postModel);
    }

    public async Task DeleteAsync(PostModel postModel)
    {
        await _postRepository.DeleteAsync(postModel);
    }

    public async Task<bool> DeleteByIdAsync(string guid)
    {
        return await _postRepository.DeleteAsyncById(guid);

    }


    public async Task<PaginationWrapper<PostModel>> GetUserFeedPaginatedAsync(string userId, int page, int pageCount)
    {
        // for now the algorithm will just get all posts and prioritize the post by date
        // in the future, the algorithm will be developed for more personalized feeds
        return await _postRepository.GetAllByDatePaginatedAsync(page, pageCount);
    }

    public async Task<PaginationWrapper<PostModel>> GetUserProfileFeedPaginatedAsync(string userId, int page, int pageCount)
    {
        return await _postRepository.GetAllByDatePaginatedAsync(page, pageCount, userId);
    }

    public async Task<IEnumerable<PostModel>> GetAllAsync()
    {
        return await _postRepository.GetAllAsync();
    }

    public async Task<bool> ReactAsync(int type, string guid, string actorId)
    {
        return await _postRepository.ReactAsync(type, guid, actorId);
    }

    public async Task<bool> CommentOnPostAsync(PostModel postModel, CommentModel commentModel)
    {
        return await _postRepository.CommentOnPostAsync(postModel, commentModel); 
    }
    
    public async Task<bool> BoostAsync(string guid, UserProfileModel userProfile)
    {
        var allowedRoles = new [] { "Partner", "Senior Partner" };
        var hasAllowedRole = false;
        foreach (var role in userProfile.Roles) 
        {
            if (allowedRoles.Contains(role))
            {
                hasAllowedRole = true;
                break;
            }
        }

        if (!hasAllowedRole)
        {
            return false;
        }
        return await _postRepository.BoostAsync(guid, userProfile.OId);
    }
}