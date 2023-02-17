using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using API.Models.Users;

namespace API.Models.Comments;

[ExcludeFromCodeCoverage]
public class CommentModel
{
    [Key] public string Id { get; set; }
    [Required] public string Author { get; set; }
    public string Message { get; set; }
    public string ImageUrl { get; set; }
    public int Likes { get; set; }
    public string[] UsersWhoLiked { get; set; }
    [Required] public DateTimeOffset CreatedDate { get; set; }
    [Required] public string ParentId { get; set; }
    [Required] public string ParentType { get; set; }
    [NotMapped] public UserProfileModel? AuthorProfile { get; set; }

    public CommentModel(string author, string message, string imageUrl, int likes, string[] usersWhoLiked, DateTimeOffset createdDate, string parentId, string parentType)
    {
        Id = Guid.NewGuid().ToString();
        Author = author;
        Message = message;
        ImageUrl = imageUrl;
        Likes = likes;
        UsersWhoLiked = usersWhoLiked;
        CreatedDate = createdDate;
        ParentId = parentId;
        ParentType = parentType;
    }

    public CommentModel(CommentCreateModel commentCreateModel, string authorId, string parentId, string parentType)
    {
        Id = Guid.NewGuid().ToString();
        Author = authorId;
        ParentId = parentId;
        ParentType = parentType;
        
        Message = commentCreateModel.Message;
        ImageUrl = commentCreateModel.ImageUrl;
        
        Likes = 0;
        UsersWhoLiked = Array.Empty<string>();
        CreatedDate = DateTimeOffset.UtcNow;
    }
}