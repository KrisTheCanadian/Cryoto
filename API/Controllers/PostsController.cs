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

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }
    [HttpGet]
    public async Task<ActionResult<PaginationWrapper<PostModel>>> GetUserFeedPaginated(string userId, int page = 1, int pageCount = 10)
    {
        return Ok(await _postService.GetUserFeedPaginatedAsync(userId, page, pageCount));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable>> GetAllPosts()
    {
        return Ok(await _postService.GetAllAsync());
    }

    [HttpGet("{guid:guid}")]
    public async Task<ActionResult<PostModel>> GetById(Guid guid)
    {
        var postModel = await _postService.GetByIdAsync(guid);
        if (postModel == null) { return NotFound(); }

        return Ok(postModel);
    }

    [HttpPost]
    public async Task<ActionResult<PostModel>> Create(PostCreateModel postCreateModel)
    {
        // get ActorID
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        var actorId = identity?.FindFirst("oid")?.Value!;
        
        var postModel = new PostModel(postCreateModel, actorId);
        await _postService.CreateAsync(postModel);
        return Ok(postModel);
    }

    [HttpPut]
    public async Task<ActionResult<PostModel>> Update(PostUpdateModel postUpdateModel)
    {
        var existingPost = await _postService.GetByIdAsync(postUpdateModel.Id);
        if(existingPost == null){ return Conflict("Cannot update the post because it does not exist.");}
        
        // get ActorID
        var identity = HttpContext.User.Identity as ClaimsIdentity;
        var actorId = identity?.FindFirst("oid")?.Value!;

        var postModel = new PostModel(postUpdateModel, actorId);
        await _postService.UpdateAsync(postModel);
        
        return Ok(postModel);
    }

    [HttpDelete]
    public async Task<ActionResult<PostModel>> Delete(Guid guid)
    {
        var existingPost = await _postService.GetByIdAsync(guid);
        if(existingPost == null){ return Conflict("Cannot update the post because it does not exist.");}

        await _postService.DeleteAsync(existingPost);
        
        return Ok($"Successfully Delete Post {guid.ToString()}");
    }
}