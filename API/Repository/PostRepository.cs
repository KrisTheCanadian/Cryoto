using System.Diagnostics.CodeAnalysis;
using API.Models.Comments;
using API.Models.Notifications;
using API.Models.Posts;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using API.Utils;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class PostRepository : IPostRepository
{
    private IDataContext Context { get; set; }
    private INotificationService NotificationService { get; set; }
    private ILogger<PostRepository> Logger { get; set; }

    public PostRepository(IDataContext context, INotificationService notificationService, ILogger<PostRepository> logger)
    {
        Context = context;
        NotificationService = notificationService;
        Logger = logger;
    }

    public async Task<PostModel?> GetByIdAsync(string guid)
    {
        var post = await Context.Posts.FirstOrDefaultAsync(x => x.Id.Equals(guid));
        if (post == null)
        {
            return null;
        }

        await GetAllComments(post);
        
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
            await GetAllComments(post);
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
            await GetAllComments(post);
        }

        return new PaginationWrapper<PostModel>(posts, page, pageCount, totalNumberOfPages);
    }

    public async Task<int> GetSentPostsCountAsync(string oid)
    {
        return await Context.Posts.Where(postModel => postModel.Author == oid).CountAsync();
    }
    public async Task<int> GetReceivedPostsCountAsync(string oid)
    {
        return await Context.Posts.Where(postModel => postModel.Recipients.Any(recipientOid => recipientOid == oid)).CountAsync();
    }

    public async Task<bool> ReactAsync(int type, string guid, string actorId)
    {
        var post = Context.Posts.FirstOrDefault(x => x.Id.Equals(guid));
        if (post == null) { return false; }
        
        // check type
        // 0 = Heart
        // 1 = Claps
        // 2 = Celebrations

        switch (type)
        {
            case 0:
                ToggleHeart(actorId, post);
                break;
            case 1:
                ToggleClap(actorId, post);
                break;
            case 2:
                ToggleCelebrations(actorId, post);
                break;
            default:
                Logger.LogWarning("Invalid type reaction {Type}", type);
                return false;
        }
        
        if (!post.UsersWhoReacted.Contains(actorId))
        {
            // get user who reacted
            var user = await Context.UserProfiles.FirstOrDefaultAsync(x => x.OId.Equals(actorId));
            await SendReactNotificationAsync(actorId, user, post);
        }


        Context.Posts.Update(post);
        
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task<bool> CommentOnPostAsync(PostModel postModel, CommentModel commentModel)
    {
        postModel.CommentIds = postModel.CommentIds.Append(commentModel.Id).ToArray();
        
        // add comment to db as well
        Context.Comments.Add(commentModel);
        // add the comment to the post
        Context.Posts.Update(postModel);
        
        return await Context.SaveChangesAsync() > 0;
    }

    private async Task SendReactNotificationAsync(string actorId, UserProfileModel? user, PostModel post)
    {
        if (user == null)
        {
            Logger.LogWarning("User with id {ActorId} not found", actorId);
            return;
        }

        post.UsersWhoReacted = post.UsersWhoReacted.Append(actorId).ToArray();

        // Send Notification
        // public Notification(string senderId, string receiverId, string message, string type, double amount)
        var notification = new Notification(
            actorId,
            post.Author,
            $"{user.Name} Reacted to your post",
            "Reaction",
            0
        );

        await NotificationService.SendNotificationAsync(notification);

        // send email notification
        await NotificationService.SendEmailAsync(post.Author, "New Reaction", $"<h1>{user.Name} Reacted to your post</h1>");
    }
    
    private async Task GetAllComments(PostModel postModel)
    {
        var comments = await Context.Comments.AsNoTracking().Where(x => x.ParentType == "Post" && x.ParentId == postModel.Id).OrderByDescending(x=> x.CreatedDate).ToListAsync();
        foreach (var comment in comments)
        {
            comment.AuthorProfile = await Context.UserProfiles.AsNoTracking()
                .FirstOrDefaultAsync(x => x.OId.Equals(comment.Author));
        }
        postModel.Comments = comments;
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
    
    private static void ToggleCelebrations(string actorId, PostModel post)
    {
        post.Celebrations = post.Celebrations.Contains(actorId) ? post.Celebrations.Where(x => !x.Equals(actorId)).ToArray() : 
            post.Celebrations.Append(actorId).ToArray();
    }

    private static void ToggleClap(string actorId, PostModel post)
    {
        post.Claps = post.Claps.Contains(actorId) ? post.Claps.Where(x => !x.Equals(actorId)).ToArray() :
            post.Claps.Append(actorId).ToArray();
    }

    private static void ToggleHeart(string actorId, PostModel post)
    {
        post.Hearts = post.Hearts.Contains(actorId) ? post.Hearts.Where(x => !x.Equals(actorId)).ToArray() :
            post.Hearts.Append(actorId).ToArray();
    }
}