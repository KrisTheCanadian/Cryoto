using API.Models.Comments;

namespace API.Services.Interfaces;

public interface ICommentService
{
    Task<CommentModel?> GetCommentById(string id);
    Task<bool> DeleteComment(CommentModel comment);
}