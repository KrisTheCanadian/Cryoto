using System.Collections;
using System.Security.Claims;
using API.Models.Posts;
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
    private readonly ICryptoService _cryptoService;
    private readonly IPostService _postService;


    public PostsController(IPostService postService, ICryptoService cryptoService)
    {
        _postService = postService;
        _cryptoService = cryptoService;
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
        // get ActorID
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        var actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;

        var postModel = new PostModel(postCreateModel, actorId);
        var created = await _postService.CreateAsync(postModel);
        if (!created)
            return BadRequest("Could not create the post");
        var createdPostModel = await _postService.GetByIdAsync(postModel.Id);
        var amount = (double)createdPostModel!.Coins;
        if (amount == 0) return Ok(createdPostModel);


        var actorBalance = await _cryptoService.GetTokenBalanceAsync(actorId, "toAward");
        if (amount * createdPostModel.RecipientProfiles.Count() > actorBalance)
        {
            await _postService.DeleteByIdAsync(createdPostModel.Id);
            return BadRequest("Your balance is not enough");
        }

        var oIdsList = new List<string> { actorId };
        foreach (var recipientProfile in createdPostModel.RecipientProfiles)
        {
            oIdsList.Add(recipientProfile.OId);
            await _cryptoService.SendTokens(amount, actorId, recipientProfile.OId);
            await _cryptoService.UpdateTokenBalance(amount, recipientProfile.OId, "toSpend");
            await _cryptoService.UpdateTokenBalance(-amount, actorId, "toAward");
        }

        _cryptoService.QueueTokenUpdate(oIdsList);


        return Ok(createdPostModel);
    }

    [HttpPut]
    public async Task<ActionResult<PostModel>> Update(PostUpdateModel postUpdateModel)
    {
        var existingPost = await _postService.GetByIdAsync(postUpdateModel.Id);
        if (existingPost == null) return Conflict("Cannot update the post because it does not exist.");

        // get ActorID
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        var actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;

        var postModel = new PostModel(postUpdateModel, actorId);
        var updated = await _postService.UpdateAsync(postModel);
        if (!updated) return BadRequest("Could not upddate the post");
        var updatedPostModel = await _postService.GetByIdAsync(postModel.Id);

        return Ok(updatedPostModel);
    }

    [HttpDelete]
    public async Task<ActionResult<PostModel>> Delete(string guid)
    {
        var existingPost = await _postService.GetByIdAsync(guid);
        if (existingPost == null) return Conflict("Cannot update the post because it does not exist.");

        await _postService.DeleteAsync(existingPost);

        return Ok($"Successfully Delete Post {guid}");
    }
}