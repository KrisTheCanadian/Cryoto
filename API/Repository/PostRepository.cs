using API.Models.Posts;
using API.Models.WorkDay;
using API.Repository.Interfaces;
using API.Utils;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class PostRepository : IPostRepository
{
    private IDataContext Context { get; set; }
    
    public PostRepository(IDataContext context)
    {
        Context = context;
    }

    public async Task<PostModel?> GetByIdAsync(Guid guid)
    {
        var post = await Context.Posts.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(guid.ToString()));
        if (post == null) { return null;}
        await GetAllProfiles(post);
        return post;
    }

    public async Task CreateAsync(PostModel postModel)
    {
        Context.Posts.Add(postModel);
        await Context.SaveChangesAsync();
    }

    public async Task UpdateAsync(PostModel postModel)
    {
        Context.Posts.Update(postModel);
        await Context.SaveChangesAsync();
    }

    public async Task DeleteAsync(PostModel postModel)
    {
        Context.Posts.Remove(postModel);
        await Context.SaveChangesAsync();
    }

    public async Task<IEnumerable<PostModel>> GetAllAsync()
    {
        var posts = await Context.Posts.AsNoTracking().ToListAsync();
        foreach (var post in posts) { await GetAllProfiles(post); }

        return posts;
    }

    public async Task<PaginationWrapper<PostModel>> GetAllByDatePaginatedAsync(int page, int pageCount = 10)
    {
        pageCount = pageCount < 1 ? 10 : pageCount; 
        page = page < 1 ? 1 : page;

        var posts = await Context.Posts
            .OrderByDescending(x => x.CreatedDate)
            .Skip((page - 1) * pageCount)
            .Take(pageCount)
            .ToListAsync();
        var totalNumberOfPosts = Context.Posts.Count();
        var totalNumberOfPages = (totalNumberOfPosts / pageCount) + 1;
        foreach (var post in posts) { await GetAllProfiles(post); }
        return new PaginationWrapper<PostModel>(posts, page, pageCount, totalNumberOfPages);
    }

    private async Task GetAllProfiles(PostModel postModel)
    {
        // get profile of author
        postModel.AuthorProfile = await Context.UserProfiles.AsNoTracking().FirstAsync(x => x.OId.Equals(postModel.Author));

        var recipientProfiles = new List<UserProfileModel>();
        // get profiles of recipients
        foreach(var author in postModel.Recipients)
        {
            recipientProfiles.Add(await Context.UserProfiles.AsNoTracking().FirstAsync(x => x.OId.Equals(author)));
        }

        postModel.RecipientProfiles = recipientProfiles.ToList();
    }
}