using System.Collections;
using System.Security.Claims;
using API.Models.Comments;
using API.Models.Notifications;
using API.Models.Posts;
using API.Models.Transactions;
using API.Models.Users;
using API.Services.Interfaces;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class PostsController : ControllerBase
{
    private readonly string _actorId;
    private readonly ICryptoService _cryptoService;
    private readonly ILogger<PostsController> _logger;
    private readonly INotificationService _notificationService;
    private readonly IPostService _postService;
    private readonly ITransactionService _transactionService;
    private readonly IUserProfileService _userProfileService;


    public PostsController(IPostService postService, ICryptoService cryptoService,
        ITransactionService transactionService, IHttpContextAccessor contextAccessor,
        INotificationService notificationService, IUserProfileService userProfileService,
        ILogger<PostsController> logger)
    {
        _postService = postService;
        _cryptoService = cryptoService;
        _transactionService = transactionService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
        _notificationService = notificationService;
        _userProfileService = userProfileService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<PaginationWrapper<PostModel>>> GetUserFeedPaginated(string userId, int page = 1,
        int pageCount = 10)
    {
        return Ok(await _postService.GetUserFeedPaginatedAsync(userId, page, pageCount));
    }

    [HttpGet]
    public async Task<ActionResult<PaginationWrapper<PostModel>>> GetUserProfileFeedPaginated(string userId,
        int page = 1,
        int pageCount = 10)
    {
        return Ok(await _postService.GetUserProfileFeedPaginatedAsync(userId, page, pageCount));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable>> GetAllPosts()
    {
        return Ok(await _postService.GetAllAsync());
    }

    [HttpGet("{guid:guid}")]
    public async Task<ActionResult<PostModel>> GetById(string guid)
    {
        var postModel = await _postService.GetByIdAsync(guid);
        if (postModel == null) return NotFound();

        return Ok(postModel);
    }

    [HttpPost("{postId:guid}")]
    public async Task<ActionResult<CommentModel>> CommentOnPost(CommentCreateModel commentCreateModel, Guid postId)
    {
        var commentModel = new CommentModel(commentCreateModel, _actorId, postId.ToString(), "Post");

        var postModel = await _postService.GetByIdAsync(postId.ToString());
        if (postModel == null) return NotFound();

        var created = await _postService.CommentOnPostAsync(postModel, commentModel);
        if (!created) return BadRequest("Could not comment on the post");

        var notificationSent = await _notificationService.SendCommentNotification(_actorId, postId.ToString(), postModel);
        if (!notificationSent)
        {
            _logger.LogWarning("Failed to send reaction notification on post '{guid}' by user {_actorId}", postId.ToString(), _actorId);
        }
        return Ok(commentModel);
    }

    [HttpPost]
    public async Task<ActionResult<PostModel>> Create(PostCreateModel postCreateModel)
    {
        var postModel = new PostModel(postCreateModel, _actorId);
        if (postModel.Recipients.Contains(_actorId))
            return BadRequest("Could not create the post");
        var created = await _postService.CreateAsync(postModel);
        if (!created)
            return BadRequest("Could not create the post");
        var createdPostModel = await _postService.GetByIdAsync(postModel.Id);
        var amount = (double)createdPostModel!.Coins;
        if (amount == 0)
        {
            await _userProfileService.IncrementRecognitionsSent(_actorId);
            foreach (var recipientProfile in createdPostModel.RecipientProfiles)
            {
                await _userProfileService.IncrementRecognitionsReceived(recipientProfile.OId);
                await SendNotification(postCreateModel, recipientProfile, postModel, amount);
            }

            return Ok(createdPostModel);
        }

        var actorBalance = _cryptoService.GetTokenBalanceAsync(_actorId, "toAward");
        if (amount * createdPostModel.RecipientProfiles.Count() > actorBalance)
        {
            await _postService.DeleteByIdAsync(createdPostModel.Id);
            return BadRequest("Your balance is not enough");
        }


        var oIdsList = new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { _actorId } };
        var successfulRecipients = new List<UserProfileModel>();
        foreach (var recipientProfile in createdPostModel.RecipientProfiles)
            try
            {
                var rpcTransactionResult = await _cryptoService.SendTokens(amount, _actorId, recipientProfile.OId);
                if (rpcTransactionResult?.error != null) continue;
                await _cryptoService.UpdateTokenBalance(amount, recipientProfile.OId, "toSpend");
                await _cryptoService.UpdateTokenBalance(-amount, _actorId, "toAward");
                await _transactionService.AddTransactionAsync(new TransactionModel(recipientProfile.OId, "toSpend",
                    _actorId,
                    "toAward", amount, "Recognition", postCreateModel.CreatedDate));

                await _userProfileService.IncrementRecognitionsReceived(recipientProfile.OId);
                await SendNotification(postCreateModel, recipientProfile, postModel, amount);
                oIdsList[1].Add(recipientProfile.OId);
                successfulRecipients.Add(recipientProfile);
            }
            catch
            {
                _logger.LogWarning("Failed to send tokens to {Name} with oId: {Id}", recipientProfile.Name,
                    recipientProfile.OId);
            }

        if (successfulRecipients.Count == 0)
        {
            await _postService.DeleteByIdAsync(createdPostModel.Id);
            return BadRequest("Could not process any transaction and create the post");
        }

        if (createdPostModel.RecipientProfiles.Count() > successfulRecipients.Count)
            createdPostModel.RecipientProfiles = successfulRecipients;

        await _userProfileService.IncrementRecognitionsSent(_actorId);
        _cryptoService.QueueTokenUpdate(oIdsList);

        return Ok(createdPostModel);
    }

    // send notification to recipient using notification service
    private async Task SendNotification(PostCreateModel postCreateModel, UserProfileModel recipientProfile,
        PostModel postModel, double amount)
    {
        var actorProfile = await _userProfileService.GetUserByIdAsync(_actorId);

        await _notificationService.SendNotificationAsync(new Notification(_actorId, recipientProfile.OId,
            postCreateModel.Message, postModel.PostType, (int)postCreateModel.Coins));

        var senderName = "a Team Member";

        if (actorProfile != null) senderName = actorProfile.Name;


        var subject = "You have been awarded " + amount + " tokens" + " by " + senderName + "!";
        var htmlContent = "<h1>You have been awarded " + amount + " tokens" + " by " + senderName + "!</h1>" +
                          "<h3>" + postCreateModel.Message + "</h3>";

        await _notificationService.SendEmailAsync(recipientProfile.Email, subject, htmlContent, true);
    }


    [HttpPut]
    public async Task<ActionResult<PostModel>> Update(PostUpdateModel postUpdateModel)
    {
        var existingPost = await _postService.GetByIdAsync(postUpdateModel.Id);
        if (existingPost == null) return Conflict("Cannot update the post because it does not exist.");

        if (_actorId != existingPost.AuthorProfile?.OId) return BadRequest("You are not the author of this post");

        var postModel = new PostModel(postUpdateModel, _actorId);
        var updated = await _postService.UpdateAsync(postModel);
        if (!updated) return BadRequest("Could not update the post");
        var updatedPostModel = await _postService.GetByIdAsync(postModel.Id);

        return Ok(updatedPostModel);
    }

    [HttpDelete]
    public async Task<ActionResult<PostModel>> Delete(string guid)
    {
        var existingPost = await _postService.GetByIdAsync(guid);
        if (existingPost == null) return Conflict("Cannot delete the post because it does not exist.");

        if (_actorId != existingPost.AuthorProfile?.OId) return BadRequest("You are not the author of this post");

        await _postService.DeleteAsync(existingPost);

        return Ok($"Successfully Delete Post {guid}");
    }

    [HttpPost]
    public async Task<ActionResult<PostModel>> React(int type, string guid)
    {
        var existingPost = await _postService.GetByIdAsync(guid);
        if (existingPost == null) return Conflict("Cannot react to the post because it does not exist.");

        var liked = await _postService.ReactAsync(type, guid, _actorId);
        if (!liked) return BadRequest("Could not like the post");

        var notificationSent = await _notificationService.SendReactionNotification(_actorId, guid, type, existingPost);
        if (!notificationSent)
        {
            _logger.LogWarning("Failed to send reaction notification on post '{guid}' by user {_actorId}", guid, _actorId);
        }
        return Ok(await _postService.GetByIdAsync(guid));
    }
}