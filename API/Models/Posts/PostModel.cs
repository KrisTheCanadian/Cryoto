using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using API.Models.Users;

namespace API.Models.Posts;

[ExcludeFromCodeCoverage]
public class PostModel
{
    [Key] public string Id { get; set; }

    // Author Id (foreign key)
    [Required] public string Author { get; set; }

    public string Message { get; set; }

    // User Profile Ids (foreign keys)
    [Required] public string[] Recipients { get; set; }
    [Required] public string[] Tags { get; set; }
    [Required] public DateTimeOffset CreatedDate { get; set; }
    [Required] public string PostType { get; set; }
    public bool IsTransactable { get; set; }
    public ulong Coins { get; set; }
    public string ImageUrl { get; set; }
    
    // reactions
    public string[] Hearts { get; set; }
    public string[] Claps { get; set; }
    public string[] Celebrations { get; set; }
    
    public string[] UsersWhoReacted { get; set; }

    [NotMapped] public IEnumerable<UserProfileModel> RecipientProfiles { get; set; }
    [NotMapped] public UserProfileModel? AuthorProfile { get; set; }


    public PostModel(string author, string message, string[] recipients, string[] tags, DateTimeOffset createdDate,
        string postType = "General", bool isTransactable = false, ulong coins = 0, string imageUrl = "")
    {
        Id = Guid.NewGuid().ToString();
        Author = author;
        Message = message;
        Recipients = recipients;
        Tags = tags;

        // TODO: Check this string against an enum of postTypes
        PostType = postType;
        CreatedDate = createdDate;
        IsTransactable = isTransactable;

        // if transactable is false, the coins should be 0
        Coins = isTransactable ? coins : 0;

        RecipientProfiles = new List<UserProfileModel>();
        ImageUrl = imageUrl;
        
        Hearts = Array.Empty<string>();
        Claps = Array.Empty<string>();
        Celebrations = Array.Empty<string>();
        UsersWhoReacted = Array.Empty<string>();
    }

    public PostModel(PostCreateModel postCreateModel, string actor)
    {
        Id = Guid.NewGuid().ToString();

        Author = actor;
        Message = postCreateModel.Message;
        Recipients = postCreateModel.Recipients;
        Tags = postCreateModel.Tags;
        CreatedDate = postCreateModel.CreatedDate;

        // TODO: Validate PostType
        PostType = postCreateModel.PostType;
        Coins = postCreateModel.Coins;
        IsTransactable = Coins != 0;

        RecipientProfiles = new List<UserProfileModel>();
        ImageUrl = postCreateModel.ImageUrl;
        
        Hearts = Array.Empty<string>();
        Claps = Array.Empty<string>();
        Celebrations = Array.Empty<string>();
        UsersWhoReacted = Array.Empty<string>();
    }

    public PostModel(PostUpdateModel postUpdateModel, string actor)
    {
        Id = postUpdateModel.Id;
        Author = actor;
        Message = postUpdateModel.Message;
        Recipients = postUpdateModel.Recipients;
        Tags = postUpdateModel.Tags;
        CreatedDate = postUpdateModel.CreatedDate;

        // TODO: Validate PostType
        PostType = postUpdateModel.PostType;
        Coins = postUpdateModel.Coins;
        IsTransactable = Coins != 0;

        RecipientProfiles = new List<UserProfileModel>();
        ImageUrl = postUpdateModel.ImageUrl;
        
        Hearts = postUpdateModel.Hearts;
        Claps = postUpdateModel.Claps;
        Celebrations = postUpdateModel.Celebrations;
        UsersWhoReacted = postUpdateModel.UsersWhoReacted;
    }
}