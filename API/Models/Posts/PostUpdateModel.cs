namespace API.Models.Posts;

public class PostUpdateModel
{
    public Guid Id { get; set; }
    public string Message { get; set; }
    // User Profile Ids (foreign keys)
    public string[] Recipients { get; set; }
    public string[] Tags { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
    public string PostType { get; set; }
    public bool IsTransactable { get; set; }
    public ulong Coins { get; set; }
    
    public PostUpdateModel(Guid id, string message, string[] recipients, string[] tags, DateTimeOffset createdDate, string postType, bool isTransactable, ulong coins = 0)
    {
        Id = id;
        Message = message;
        Recipients = recipients;
        Tags = tags;
        CreatedDate = createdDate;
        PostType = postType;
        IsTransactable = isTransactable;
        Coins = coins;
    }
}