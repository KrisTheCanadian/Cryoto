using System.Collections;
using System.Security.Claims;
using API.Models.Notifications;
using API.Models.Transactions;
using API.Models.Posts;
using API.Models.Users;
using API.Services.Interfaces;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class PostsController : ControllerBase
{
    private readonly ICryptoService _cryptoService;
    private readonly IPostService _postService;
    private readonly ITransactionService _transactionService;
    private readonly string _actorId;
    private readonly INotificationService _notificationService;
    private readonly IUserProfileService _userProfileService;


    public PostsController(IPostService postService, ICryptoService cryptoService,
        ITransactionService transactionService, IHttpContextAccessor contextAccessor,
        INotificationService notificationService, IUserProfileService userProfileService)
    {
        _postService = postService;
        _cryptoService = cryptoService;
        _transactionService = transactionService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
        _notificationService = notificationService;
        _userProfileService = userProfileService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginationWrapper<PostModel>>> GetUserFeedPaginated(string userId, int page = 1,
        int pageCount = 10)
    {
        return Ok(await _postService.GetUserFeedPaginatedAsync(userId, page, pageCount));
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
        if (amount == 0) return Ok(createdPostModel);


        var actorBalance = await _cryptoService.GetTokenBalanceAsync(_actorId, "toAward");
        if (amount * createdPostModel.RecipientProfiles.Count() > actorBalance)
        {
            await _postService.DeleteByIdAsync(createdPostModel.Id);
            return BadRequest("Your balance is not enough");
        }

        var oIdsList = new List<List<string>>
            { new List<string> { "tokenUpdateQueue" }, new List<string> { _actorId } };
        foreach (var recipientProfile in createdPostModel.RecipientProfiles)
        {
            oIdsList[1].Add(recipientProfile.OId);
            await _cryptoService.SendTokens(amount, _actorId, recipientProfile.OId);
            await _cryptoService.UpdateTokenBalance(amount, recipientProfile.OId, "toSpend");
            await _cryptoService.UpdateTokenBalance(-amount, _actorId, "toAward");
            await _transactionService.AddTransactionAsync(new TransactionModel(recipientProfile.OId, "toSpend", _actorId,
                "toAward", amount, "Recognition", postCreateModel.CreatedDate));
            
            await SendNotification(postCreateModel, recipientProfile, postModel, amount);
        }

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

        if (actorProfile != null)
        {
            senderName = actorProfile.Name;
        }


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

        await _postService.DeleteAsync(existingPost);

        return Ok($"Successfully Delete Post {guid}");
    }
}