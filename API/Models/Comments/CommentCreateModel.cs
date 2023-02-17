using System.Diagnostics.CodeAnalysis;

namespace API.Models.Comments;

[ExcludeFromCodeCoverage]
public class CommentCreateModel
{
    public string Message { get; set; }
    public string ImageUrl { get; set; }

    public CommentCreateModel(string message, string imageUrl)
    {
        Message = message;
        ImageUrl = imageUrl;
    }
}