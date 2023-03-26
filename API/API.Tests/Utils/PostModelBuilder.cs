using System;
using System.Collections.Generic;
using API.Models.Posts;
using API.Models.Users;

namespace API.Tests.Utils;

public class PostModelBuilder
{
    private readonly PostModel _post = new(
        "",
        "",
        Array.Empty<string>(),
        Array.Empty<string>(),
        DateTimeOffset.Now,
        Array.Empty<UserDto>());

    public PostModelBuilder WithId(string id)
    {
        _post.Id = id;
        return this;
    }

    public PostModelBuilder WithMessage(string message)
    {
        _post.Message = message;
        return this;
    }

    public PostModelBuilder WithAuthor(string author)
    {
        _post.Author = author;
        return this;
    }

    public PostModelBuilder WithTags(string[] tags)
    {
        _post.Tags = tags;
        return this;    
    }

    public PostModelBuilder WithRecipientProfiles(IEnumerable<UserDto> recipientProfiles)
    {
        _post.RecipientProfiles = recipientProfiles;
        return this;
    }
    
    public PostModelBuilder WithRecipients(string[] recipients)
    {
        _post.Recipients = recipients;
        return this;
    }
    
    public PostModelBuilder WithPostType(string postType)
    {
        _post.PostType = postType;
        return this;
    }

    public PostModelBuilder WithCoins(ulong coins)
    {
        _post.IsTransactable = true;
        _post.Coins = coins;
        return this;
    }

    public PostModel Build()
    {
        return _post;
    }

    public PostModel BuildDefaultFakePost()
    {
        return new PostModelBuilder()                
            .WithId("6aa88f64-5717-4562-b3fc-2c963e66afa6")
            .WithMessage("A Random Message")
            .WithAuthor("")
            .WithTags(new[] { "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
            .WithRecipientProfiles(GetUserProfileModelList())
            .WithPostType("General")
            .WithCoins(50)
            .Build();
    }
    
    private static IEnumerable<UserDto> GetUserProfileModelList()
    {
        var roles1 = new[] { "roles1" };
        var profile = new UserProfileModel("oid1", "name1", "email1", "en1", roles1);
        var userProfileModelList = new List<UserDto>
        {
            new(profile)
        };
        return userProfileModelList;
    }
}
