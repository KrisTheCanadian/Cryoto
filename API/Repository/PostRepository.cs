using System.Diagnostics.CodeAnalysis;
using API.Models.Posts;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Utils;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class PostRepository : IPostRepository
{
    private IDataContext Context { get; set; }

    public PostRepository(IDataContext context)
    {
        Context = context;
    }

    public async Task<PostModel?> GetByIdAsync(string guid)
    {
        var post = await Context.Posts.FirstOrDefaultAsync(x => x.Id.Equals(guid));
        if (post == null)
        {
            return null;
        }
        
        return await GetAllProfiles(post);
    }

    public async Task<bool> CreateAsync(PostModel postModel)
    {
        Context.Posts.Add(postModel);
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAsync(PostModel postModel)
    {
        Context.Posts.Update(postModel);
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task DeleteAsync(PostModel postModel)
    {
        Context.Posts.Remove(postModel);
        await Context.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsyncById(string guid)
    {
        var postModel = await GetByIdAsync(guid);
        Context.Posts.Remove(postModel!);
        return await Context.SaveChangesAsync() > 0;
    }


    public async Task<IEnumerable<PostModel>> GetAllAsync()
    {
        var posts = await Context.Posts.AsNoTracking().ToListAsync();
        foreach (var post in posts)
        {
            await GetAllProfiles(post);
        }

        return posts;
    }

    public async Task<PaginationWrapper<PostModel>> GetAllByDatePaginatedAsync(int page, int pageCount = 10, string oid="oid")
    {
        pageCount = pageCount < 1 ? 10 : pageCount;
        page = page < 1 ? 1 : page;

        List<PostModel> posts;
        if (oid.Equals("oid"))
            posts = await Context.Posts
            .OrderByDescending(x => x.CreatedDate)
            .Skip((page - 1) * pageCount)
            .Take(pageCount)
            .ToListAsync();
        else
            posts = await Context.Posts.Where(postModel=>postModel.Author==oid || postModel.Recipients.Any(recipientOid=>recipientOid ==  oid))
                .OrderByDescending(x => x.CreatedDate)
                .Skip((page - 1) * pageCount)
                .Take(pageCount)
                .ToListAsync();
        var totalNumberOfPosts = Context.Posts.Count();
        var totalNumberOfPages = (totalNumberOfPosts / pageCount) + 1;
        foreach (var post in posts)
        {
            await GetAllProfiles(post);
        }

        return new PaginationWrapper<PostModel>(posts, page, pageCount, totalNumberOfPages);
    }

    public async Task<int> GetSentPostsCountAsync(string oid)
    {
        return await Context.Posts.Where(postModel => postModel.Author == oid ).CountAsync();
    }
    public async Task<int> GetReceivedPostsCountAsync(string oid)
    {
        return await Context.Posts.Where(postModel => postModel.Recipients.Any(recipientOid => recipientOid == oid)).CountAsync();
    }

    private async Task<PostModel> GetAllProfiles(PostModel postModel)
    {
        // get profile of author
        postModel.AuthorProfile = await Context.UserProfiles.AsNoTracking()
            .FirstOrDefaultAsync(x => x.OId.Equals(postModel.Author));

        var recipientProfiles = new List<UserProfileModel>();
        // get profiles of recipients
        foreach (var author in postModel.Recipients)
        {
            recipientProfiles.Add((await Context.UserProfiles.AsNoTracking()
                .FirstOrDefaultAsync(x => x.OId.Equals(author)))!);
        }

        postModel.RecipientProfiles = recipientProfiles.ToList();
        return postModel;
    }
}