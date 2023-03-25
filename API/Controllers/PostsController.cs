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
    private readonly ICommentService _commentService;
    private readonly ICryptoService _cryptoService;
    private readonly ILogger<PostsController> _logger;
    private readonly INotificationService _notificationService;
    private readonly IPostService _postService;
    private readonly ITransactionService _transactionService;
    private readonly IUserProfileService _userProfileService;


    public PostsController(IPostService postService, ICryptoService cryptoService,
        ITransactionService transactionService, IHttpContextAccessor contextAccessor,
        INotificationService notificationService, IUserProfileService userProfileService,
        ICommentService commentService,
        ILogger<PostsController> logger)
    {
        _commentService = commentService;
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
        return Ok(await _postService.GetUserFeedPaginatedAsync(page, pageCount));
    }

    [HttpGet]
    public async Task<ActionResult<PaginationWrapper<PostModel>>> GetUserProfileFeedPaginated(string userId,
        int page = 1,
        int pageCount = 10)
    {
        return Ok(await _postService.GetUserProfileFeedPaginatedAsync(userId, page, pageCount));
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

        var notificationSent =
            await _notificationService.SendCommentNotification(_actorId, postId.ToString(), postModel);
        if (!notificationSent)
            _logger.LogWarning("Failed to send reaction notification on post '{Guid}' by user {ActorId}",
                postId.ToString(), _actorId);
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

        await _cryptoService.UpdateTokenBalance(-(amount * createdPostModel.RecipientProfiles.Count()), _actorId,
            "toAward");

        var queueTokenUpdateOIdsList = new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { _actorId } };
        var successfulRecipientsProfiles = new List<UserDto>();
        var successfulRecipients = new List<string>();
        var maxResend = 10;
        var recipientProfilesList = createdPostModel.RecipientProfiles.ToList();

        while (maxResend > 0 && recipientProfilesList.Count > 0)
        {
            var didNotReceiveTransaction = new List<UserDto>();
 
            foreach (var recipientProfile in recipientProfilesList)
                try
                {
                    var rpcTransactionResult = await _cryptoService.SendTokens(amount, _actorId, recipientProfile.OId);
                    if (rpcTransactionResult.error != null)
                        didNotReceiveTransaction.Add(recipientProfile);
                    else
                    {
                        await _transactionService.AddTransactionAsync(new TransactionModel(recipientProfile.OId, "toSpend",
                            _actorId, "toAward", amount, "Recognition", postCreateModel.CreatedDate));
                        await _userProfileService.IncrementRecognitionsReceived(recipientProfile.OId);
                        await SendNotification(postCreateModel, recipientProfile, postModel, amount);
                        queueTokenUpdateOIdsList[1].Add(recipientProfile.OId);
                        successfulRecipients.Add(recipientProfile.OId);
                        successfulRecipientsProfiles.Add(recipientProfile);
                    }
                }
                catch
                {
                    _logger.LogWarning("Failed to send tokens to {Name} with oId: {Id}", recipientProfile.Name,
                        recipientProfile.OId);
                }

            maxResend -= 1;
            recipientProfilesList = didNotReceiveTransaction;
        }

        if (successfulRecipientsProfiles.Count == 0)
        {
            await _cryptoService.UpdateTokenBalance(amount * createdPostModel.RecipientProfiles.Count(), _actorId,
                "toAward");

            await _postService.DeleteByIdAsync(createdPostModel.Id);
            return BadRequest("Could not process any transaction and create the post");
        }

        if (createdPostModel.RecipientProfiles.Count() > successfulRecipientsProfiles.Count)
        {
            var failedRecipientCount = createdPostModel.RecipientProfiles.Count() - successfulRecipientsProfiles.Count;
            await _cryptoService.UpdateTokenBalance(amount * failedRecipientCount, _actorId, "toAward");

            createdPostModel.RecipientProfiles = successfulRecipientsProfiles;
            createdPostModel.Recipients = successfulRecipients.ToArray();
            await _postService.UpdateAsync(createdPostModel);
        }

        await _userProfileService.IncrementRecognitionsSent(_actorId);
        _cryptoService.QueueTokenUpdate(queueTokenUpdateOIdsList);

        return Ok(createdPostModel);
    }

    // send notification to recipient using notification service
    private async Task SendNotification(PostCreateModel postCreateModel, UserDto recipientProfile,
        PostModel postModel, double amount)
    {
        var actorProfile = await _userProfileService.GetUserByIdAsync(_actorId);

        if (actorProfile == null)
        {
            _logger.LogWarning("Failed to send notification to {Name} with oId: {Id}", recipientProfile.Name,
                recipientProfile.OId);
            return;
        }

        await _notificationService.SendNotificationAsync(new Notification(_actorId, recipientProfile.OId,
            postCreateModel.Message, postModel.PostType, (int)postCreateModel.Coins));

        var senderName = actorProfile.Name;
        var subject = "You have been awarded " + amount + " tokens" + " by " + senderName + "!";
        var htmlContent = "<h1>You have been awarded " + amount + " tokens" + " by " + senderName + "!</h1>" +
                          "<h3>" + postCreateModel.Message + "</h3>";

        await _notificationService.SendEmailAsync(actorProfile.Email, subject, htmlContent, true);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteComment(Guid id)
    {
        var comment = await _commentService.GetCommentById(id.ToString());
        if (comment == null) return NotFound();
        if (comment.Author != _actorId) return Unauthorized();
        var isSuccessful = await _commentService.DeleteComment(comment);
        if (!isSuccessful) return BadRequest();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<PostModel>> React(int type, string guid)
    {
        var existingPost = await _postService.GetByIdAsync(guid);
        if (existingPost == null) return Conflict("Cannot react to the post because it does not exist.");

        var liked = await _postService.ReactAsync(type, guid, _actorId);
        if (!liked) return BadRequest("Could not like the post");

        var notificationSent = await _notificationService.SendReactionNotification(_actorId, type, existingPost);
        if (!notificationSent)
            _logger.LogWarning("Failed to send reaction notification on post '{Guid}' by user {ActorId}", guid,
                _actorId);
        return Ok(await _postService.GetByIdAsync(guid));
    }

    [HttpPost]
    [Authorize(Roles = "Partner,SeniorPartner")]
    public async Task<ActionResult<PostModel>> Boost(string guid)
    {
        var existingPost = await _postService.GetByIdAsync(guid);
        if (existingPost == null)
        {
            _logger.LogError("Could not retrieve post '{Guid}'", guid);
            return BadRequest("Cannot boost to the post because it does not exist.");
        }

        var actorProfile = await _userProfileService.GetUserByIdAsync(_actorId);
        if (actorProfile == null)
        {
            _logger.LogError("Could not retrieve user '{ActorId}'", _actorId);
            return BadRequest("Cannot boost the post because user does not exist.");
        }

        if (existingPost.Boosts.Contains(_actorId))
        {
            return BadRequest("Post already boosted.");
        }
        
        var boosted = await _postService.BoostAsync(guid, actorProfile);
        if (!boosted)
        {
            _logger.LogError("Could not complete boost reaction to boost post '{Guid}' by booster '{ActorId}'", guid,
                _actorId);
            return BadRequest("Could not boost the post.");
        }
        
        var recipients = existingPost.Recipients;
        var transactionSuccess = await _cryptoService.BoostRecognition(_actorId, recipients.ToList());
        if (!transactionSuccess)
        {
            _logger.LogError("Could not complete transaction to boost post '{Guid}' by booster '{ActorId}'", guid,
                _actorId);
            var unboosted = await _postService.UnboostAsync(guid, actorProfile);
            if (!unboosted)
            {
                _logger.LogError("Could not unboost post '{Guid}' by booster '{ActorId}'", guid,
                    _actorId);
            }
            return BadRequest("Could not complete boost transaction.");
        }
        
        var notificationSent = await _notificationService.SendBoostNotification(_actorId, existingPost);
        if (!notificationSent)
            _logger.LogWarning("Failed to send boost notification on post '{Guid}' by user {ActorId}", guid, _actorId);
        return Ok(await _postService.GetByIdAsync(guid));
    }
}