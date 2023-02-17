using API.Models.Comments;

namespace API.Repository.Interfaces;

public interface ICommentRepository
{
    Task<CommentModel?> GetCommentById(string id);
    Task<bool> DeleteComment(CommentModel comment);
}