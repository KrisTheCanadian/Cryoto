using System.Collections;
using System.Security.Claims;
using API.Models.Posts;
using API.Services.Interfaces;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;
    private readonly ICryptoService _cryptoService;


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
        if (postModel == null)
        {
            return NotFound();
        }

        return Ok(postModel);
    }

    [HttpPost]
    public async Task<ActionResult<PostModel>> Create(PostCreateModel postCreateModel)
    {
        // get ActorID
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        var actorId = identity?.FindFirst("oid")?.Value!;

        var postModel = new PostModel(postCreateModel, actorId);
        var created = await _postService.CreateAsync(postModel);
        if (!created)
            return BadRequest("Could not create the post");
        var createdPostModel = await _postService.GetByIdAsync(postModel.Id);

        var actorBalance = await _cryptoService.GetTokenBalanceAsync(actorId, "toAward");
        if (createdPostModel!.Coins * (ulong)createdPostModel.RecipientProfiles.Count() > actorBalance)
        {
            await _postService.DeleteByIdAsync(createdPostModel.Id);
            return BadRequest("Your balance is not enough");
        }

        var oIdsList = new List<string> { actorId };
        foreach (var recipientProfile in createdPostModel.RecipientProfiles)
        {
            oIdsList.Add(recipientProfile.OId);
            await _cryptoService.SendTokens(createdPostModel.Coins, actorId, recipientProfile.OId);
        }

        _cryptoService.QueueTokenUpdate(oIdsList);
        return Ok(createdPostModel);
    }

    [HttpPut]
    public async Task<ActionResult<PostModel>> Update(PostUpdateModel postUpdateModel)
    {
        var existingPost = await _postService.GetByIdAsync(postUpdateModel.Id);
        if (existingPost == null)
        {
            return Conflict("Cannot update the post because it does not exist.");
        }

        // get ActorID
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        var actorId = identity?.FindFirst("oid")?.Value!;

        var postModel = new PostModel(postUpdateModel, actorId);
        await _postService.UpdateAsync(postModel);

        return Ok(postModel);
    }

    [HttpDelete]
    public async Task<ActionResult<PostModel>> Delete(string guid)
    {
        var existingPost = await _postService.GetByIdAsync(guid);
        if (existingPost == null)
        {
            return Conflict("Cannot update the post because it does not exist.");
        }

        await _postService.DeleteAsync(existingPost);

        return Ok($"Successfully Delete Post {guid}");
    }
}