using System.Diagnostics.CodeAnalysis;
using API.Models.Comments;
using API.Repository.Interfaces;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class CommentRepository : ICommentRepository
{
    private readonly IDataContext _dataContext;

    public CommentRepository(IDataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<CommentModel?> GetCommentById(string id)
    {
        return await _dataContext.Comments.FindAsync(id);
    }

    public async Task<bool> DeleteComment(CommentModel comment)
    {
        _dataContext.Comments.Remove(comment);
        return await _dataContext.SaveChangesAsync() > 0;
    }
}