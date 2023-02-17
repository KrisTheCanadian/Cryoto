using System.Security.Claims;
using API.Models.Comments;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class CommentController: ControllerBase
{
    private readonly string _actorId;
    private readonly ICommentService _commentService;
    
    public CommentController(ICommentService commentService, IHttpContextAccessor contextAccessor)
    {
        _commentService = commentService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }
    
    [HttpGet]
    public async Task<ActionResult<CommentModel>> GetById(string id)
    {
        return Ok(await _commentService.GetCommentById(id));
    }
    
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var comment = await _commentService.GetCommentById(id.ToString());
        if (comment == null) return NotFound();
        if(comment.Author != _actorId) return Unauthorized();
        var isSuccessful = await _commentService.DeleteComment(comment);
        if (!isSuccessful) return BadRequest();
        
        return Ok();
    }
}