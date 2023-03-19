using System.Diagnostics.CodeAnalysis;

namespace API.Models.Comments;

[ExcludeFromCodeCoverage]
public class CommentCreateModel
{
    public CommentCreateModel(string message, string imageUrl)
    {
        Message = message;
        ImageUrl = imageUrl;
    }

    public string Message { get; set; }
    public string ImageUrl { get; set; }
}