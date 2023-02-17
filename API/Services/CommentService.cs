using API.Models.Comments;
using API.Repository.Interfaces;
using API.Services.Interfaces;

namespace API.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    public CommentService(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }
    
    public async Task<CommentModel?> GetCommentById(string id)
    {
        return await _commentRepository.GetCommentById(id);
    }

    public async Task<bool> DeleteComment(CommentModel comment)
    {
        return await _commentRepository.DeleteComment(comment);
    }
}