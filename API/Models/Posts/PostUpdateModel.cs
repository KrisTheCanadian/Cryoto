using System.Diagnostics.CodeAnalysis;

namespace API.Models.Posts;

[ExcludeFromCodeCoverage]
public class PostUpdateModel
{
    public string Id { get; set; }

    public string Message { get; set; }

    // User Profile Ids (foreign keys)
    public string[] Recipients { get; set; }
    public string[] Tags { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
    public string PostType { get; set; }
    public bool IsTransactable { get; set; }
    public ulong Coins { get; set; }
    public string ImageUrl { get; set; }

    public PostUpdateModel(string id, string message, string[] recipients, string[] tags, DateTimeOffset createdDate,
        string postType, bool isTransactable, ulong coins = 0, string imageUrl = "")
    {
        Id = id;
        Message = message;
        Recipients = recipients;
        Tags = tags;
        CreatedDate = createdDate;
        PostType = postType;
        IsTransactable = isTransactable;
        Coins = coins;
        ImageUrl = imageUrl;
    }
}