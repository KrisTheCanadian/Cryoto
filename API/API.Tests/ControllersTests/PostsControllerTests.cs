using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Posts;
using API.Models.Users;
using API.Services.Interfaces;
using API.Utils;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xunit;

namespace API.Tests.ControllersTests;

public class PostsControllerTests
{
    private readonly IPostService _postService;
    private readonly ICryptoService _cryptoService;
    private readonly ITransactionService _transactionService;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly PostsController _controller;
    private readonly INotificationService _notificationService;
    private readonly IUserProfileService _userProfileService;
    private readonly ILogger<PostsController> _logger;


    public PostsControllerTests()
    {
         _logger = A.Fake<ILogger<PostsController>>();
        _cryptoService = A.Fake<ICryptoService>();
        _postService = A.Fake<IPostService>();
        _transactionService = A.Fake<ITransactionService>();
        _contextAccessor = A.Fake<IHttpContextAccessor>();
        _notificationService = A.Fake<INotificationService>();
        _userProfileService = A.Fake<IUserProfileService>();
        _controller = new PostsController(_postService, _cryptoService, _transactionService, _contextAccessor, _notificationService, _userProfileService, _logger);
    }

    private List<PostModel> GetFakePosts()
    {
        var post1 = new PostModel(
            "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "Test Message",
            new[] { "6fa88f64-5717-4562-b3fc-2c963f66afa6" },
            new[] { "teamwork", "leadership" },
            DateTimeOffset.Now,
            "General",
            true,
            100
        );
        var post2 = new PostModel(
            "6fa88f64-5717-4562-b3fc-2c963f66afa6",
            "Some Message",
            new[] { "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
            new[] { "work", "loyalty" },
            DateTimeOffset.Now,
            "General",
            true,
            50
        );
        return new List<PostModel>
        {
            post1,
            post2
        };
    }
    private static List<UserProfileModel> GetUserProfileModelList()
    {
        var roles1 = new[] { "roles1" };
        var userProfileModelList = new List<UserProfileModel>
        {
            new("oid1", "name1", "email1", "en1", roles1),
        };
        return userProfileModelList;
    }
    private PostModel GetFakePost()
    {
        
        return new PostModel(
            "6aa88f64-5717-4562-b3fc-2c963e66afa6",
            "A Random Message",
            new[] { "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
            new[] { "efficiency", "productivity" },
            DateTimeOffset.Now,
            GetUserProfileModelList(),
            "General",
            true,
            50);
        
    }

    private PostsController GetControllerWithIodContext(string iod)
    {
        var mockController = new PostsController(_postService, _cryptoService, _transactionService, _contextAccessor, _notificationService, _userProfileService, _logger)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            },
            HttpContext =
            {
                User = new ClaimsPrincipal()
            }
        };

        // adding claims
        var claims = new ClaimsIdentity();
        claims.AddClaim(new Claim("oid", iod));
        mockController.HttpContext.User.AddIdentity(claims);

        return mockController;
    }

    [Fact]
    public async void PostsController_GetUserFeedPaginated_ReturnsOk()
    {
        // Arrange
        var posts = GetFakePosts();
        var postsPaginated = new PaginationWrapper<PostModel>(posts, 1, posts.Count, 1);

        A.CallTo(() => _postService
                .GetUserFeedPaginatedAsync(A<string>.Ignored, A<int>.Ignored, A<int>.Ignored))
            .Returns(postsPaginated);
        // Act
        var actionResult = await _controller.GetUserFeedPaginated("6ef89e64-4325-3543-b3fc-2a963f66afa6");

        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as PaginationWrapper<PostModel>;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        Assert.Equal(posts, objectResultValue?.Data.ToList());
    }

    [Fact]
    public async void PostsController_GetAllPosts_ReturnsOk()
    {
        // Arrange
        var posts = GetFakePosts();
        A.CallTo(() => _postService.GetAllAsync()).Returns(posts);

        // Act
        var actionResult = await _controller.GetAllPosts();

        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as IEnumerable<PostModel>;
        var resultPosts = objectResultValue!.ToList();

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        Assert.Equal(posts, resultPosts);
    }

    [Fact]
    public async void PostsController_GetPostById_ReturnsOk()
    {
        // Arrange
        var post = GetFakePost();
        var postId = post.Id;

        A.CallTo(() => _postService.GetByIdAsync(postId)).Returns(post);

        // Act
        var actionResult = await _controller.GetById(postId);

        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as PostModel;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        Assert.Equal(post, objectResultValue);
    }

    [Fact]
    public async void PostsController_GetPostById_ReturnsNotFound()
    {
        // Arrange
        PostModel? post = null;

        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(post);

        // Act
        var actionResult = await _controller.GetById(A.Dummy<string>());

        var objectResult = actionResult.Result as NotFoundResult;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(NotFoundResult));
    }

    [Fact]
    public async void PostController_Create_ReturnsOk()
    {
        // Arrange
        var post = GetFakePost();
        var balance = post.Coins * 10000;
        var rpcTransactionResult = GetRpcTransactionResultSuccessful();

        A.CallTo(() => _postService.CreateAsync(A<PostModel>.Ignored)).Returns(true);
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(post);
        A.CallTo(() => _cryptoService.GetTokenBalanceAsync(A<string>._, A<string>._)).Returns(balance);
        A.CallTo(() => _cryptoService.SendTokens(A<double>._, A<string>._, A<string>._))!.Returns(rpcTransactionResult);
        var postCreateModel = new PostCreateModel(post.Message, post.Recipients, post.Tags, post.CreatedDate,
            post.PostType, post.IsTransactable, post.Coins);

        var mockController = GetControllerWithIodContext(post.Author);

        // Act
        var actionResult = await mockController.Create(postCreateModel);

        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as PostModel;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));

        Assert.Equal(post.Message, objectResultValue?.Message);
        Assert.Equal(post.Author, objectResultValue?.Author);
        Assert.Equal(post.Coins, objectResultValue?.Coins);
        Assert.Equal(post.Tags, objectResultValue?.Tags);
        Assert.Equal(post.Recipients, objectResultValue?.Recipients);
    }

    [Fact]
    public async void PostController_Update_ReturnsOk()
    {
        // Arrange
        var post = GetFakePost();
        var updatedPost = new PostModel(post.Id, "New Message", post.Recipients, post.Tags, post.CreatedDate,
            post.PostType, post.IsTransactable, 100000);

        A.CallTo(() => _postService.UpdateAsync(A<PostModel>.Ignored)).Returns(true);
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(post);
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(updatedPost);


        var postCreateModel = new PostUpdateModel(post.Id, "New Message", post.Recipients, post.Tags, post.CreatedDate,
            post.PostType, post.IsTransactable, 100000);
        var mockController = GetControllerWithIodContext(post.Author);

        // Act
        var actionResult = await mockController.Update(postCreateModel);

        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as PostModel;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));

        Assert.Equal(objectResultValue?.Message, postCreateModel.Message);
        Assert.Equal(objectResultValue?.Coins, postCreateModel.Coins);
    }

    [Fact]
    public async void PostController_Update_ReturnsConflict()
    {
        // Arrange
        PostModel? existingPost = null;
        var post = GetFakePost();

        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);

        var postCreateModel = new PostUpdateModel(post.Id, "New Message", post.Recipients, post.Tags, post.CreatedDate,
            post.PostType, post.IsTransactable, 100000);

        var mockController = GetControllerWithIodContext(post.Author);

        // Act
        var actionResult = await mockController.Update(postCreateModel);

        var objectResult = actionResult.Result as ConflictObjectResult;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(ConflictObjectResult));
    }

    [Fact]
    public async void PostController_Delete_ReturnsOk()
    {
        // Arrange
        var post = GetFakePost();

        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(post);

        var mockController = GetControllerWithIodContext(post.Author);

        // Act
        var actionResult = await mockController.Delete(post.Id);

        var objectResult = actionResult.Result as OkObjectResult;
        var objectResultValue = objectResult?.Value as string;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));

        Assert.Equal(objectResultValue, $"Successfully Delete Post {post.Id}");
    }

    [Fact]
    public async void PostController_Delete_ReturnsConflict()
    {
        // Arrange
        PostModel? existingPost = null;
        var post = GetFakePost();

        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);

        var mockController = GetControllerWithIodContext(post.Author);

        // Act
        var actionResult = await mockController.Delete(post.Id);

        var objectResult = actionResult.Result as ConflictObjectResult;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(ConflictObjectResult));
    }

    [Fact]
    public async void PostController_React_ReturnsConflict()
    {
        // Arrange
        PostModel? existingPost = null;
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);
        
        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.React(A.Dummy<int>(), A.Dummy<string>());
        
        var objectResult = actionResult.Result as ConflictObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(ConflictObjectResult));
    }
    
    [Fact]
    public async void PostController_React_ReturnsBadRequest()
    {
        // Arrange
        var post = GetFakePost();
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(post);

        A.CallTo(() => _postService.ReactAsync(0, A<string>._, A<string>._)).Returns(false);

        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.React(A.Dummy<int>(), A.Dummy<string>());
        
        var objectResult = actionResult.Result as BadRequestObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }

    [Fact]
    public async void PostController_React_ReturnsOK()
    {
        // Arrange
        var post = GetFakePost();
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(post);

        A.CallTo(() => _postService.ReactAsync(0, A<string>._, A<string>._)).Returns(true);

        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.React(A.Dummy<int>(), A.Dummy<string>());
        
        var objectResult = actionResult.Result as OkObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResult?.Value.Should().BeOfType(typeof(PostModel));
        Assert.Equal(objectResult?.Value, post);
    }
    
    [Fact]
    public async void Boost_SuccessfulBoost()
    {
        // Arrange
        var existingPost = new PostModel("authorId", "message", new []{"rec1", "rec2"}, new []{"tag"}, DateTimeOffset.UtcNow);
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new []{"role"});
        
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._)).Returns(actorProfile);
        A.CallTo(() => _cryptoService.BoostRecognition(A<string>._, A<List<string>>._)).Returns(true);
        A.CallTo(() => _postService.BoostAsync(A<string>._, A<UserProfileModel>._)).Returns(true);
        A.CallTo(() => _notificationService.SendBoostNotification(A<string>._, A<string>._, A<PostModel>._)).Returns(true);
        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.Boost("guid");
        var objectResult = actionResult.Result as OkObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResult?.Value.Should().BeOfType(typeof(PostModel));
        Assert.Equal(objectResult?.Value, existingPost);
    }
    
    [Fact]
    public async void Boost_NonExistingPost_ReturnsBadRequest()
    {
        // Arrange
        PostModel? existingPost = null;
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new []{"role"});
        
        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._)).Returns(actorProfile);
        A.CallTo(() => _cryptoService.BoostRecognition(A<string>._, A<List<string>>._)).Returns(true);
        A.CallTo(() => _postService.BoostAsync(A<string>._, A<UserProfileModel>._)).Returns(true);
        A.CallTo(() => _notificationService.SendBoostNotification(A<string>._, A<string>._, A<PostModel>._)).Returns(true);
        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.Boost("guid");
        var objectResult = actionResult.Result as BadRequestObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
        Assert.Equal("Cannot boost to the post because it does not exist.", objectResult!.Value);
    }
    
    [Fact]
    public async void Boost_NonExistingUser_ReturnsBadRequest()
    {
        // Arrange
        var existingPost = new PostModel("authorId", "message", new []{"rec1", "rec2"}, new []{"tag"}, DateTimeOffset.UtcNow);
        UserProfileModel? actorProfile = null;

        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._)).Returns(actorProfile);
        A.CallTo(() => _cryptoService.BoostRecognition(A<string>._, A<List<string>>._)).Returns(true);
        A.CallTo(() => _postService.BoostAsync(A<string>._, A<UserProfileModel>._)).Returns(true);
        A.CallTo(() => _notificationService.SendBoostNotification(A<string>._, A<string>._, A<PostModel>._)).Returns(true);
        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.Boost("guid");
        var objectResult = actionResult.Result as BadRequestObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
        Assert.Equal("Cannot boost the post because user does not exist.", objectResult!.Value);
    }
    
    [Fact]
    public async void Boost_FailedTransaction_ReturnsBadRequest()
    {
        // Arrange
        var existingPost = new PostModel("authorId", "message", new []{"rec1", "rec2"}, new []{"tag"}, DateTimeOffset.UtcNow);
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new []{"role"});

        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._)).Returns(actorProfile);
        A.CallTo(() => _cryptoService.BoostRecognition(A<string>._, A<List<string>>._)).Returns(false);
        A.CallTo(() => _postService.BoostAsync(A<string>._, A<UserProfileModel>._)).Returns(true);
        A.CallTo(() => _notificationService.SendBoostNotification(A<string>._, A<string>._, A<PostModel>._)).Returns(true);
        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.Boost("guid");
        var objectResult = actionResult.Result as BadRequestObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
        Assert.Equal("Could not complete boost transaction.", objectResult!.Value);
    }
    
    [Fact]
    public async void Boost_ReturnsBadRequest()
    {
        // Arrange
        var existingPost = new PostModel("authorId", "message", new []{"rec1", "rec2"}, new []{"tag"}, DateTimeOffset.UtcNow);
        var actorProfile = new UserProfileModel("actorId", "name", "email", "en", new []{"role"});

        A.CallTo(() => _postService.GetByIdAsync(A<string>._)).Returns(existingPost);
        A.CallTo(() => _userProfileService.GetUserByIdAsync(A<string>._)).Returns(actorProfile);
        A.CallTo(() => _cryptoService.BoostRecognition(A<string>._, A<List<string>>._)).Returns(true);
        A.CallTo(() => _postService.BoostAsync(A<string>._, A<UserProfileModel>._)).Returns(false);
        A.CallTo(() => _notificationService.SendBoostNotification(A<string>._, A<string>._, A<PostModel>._)).Returns(true);
        var mockController = GetControllerWithIodContext(A.Dummy<string>());
        
        // Act
        var actionResult = await mockController.Boost("guid");
        var objectResult = actionResult.Result as BadRequestObjectResult;
        
        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
        Assert.Equal("Could not boost the post.", objectResult!.Value);
    }
    
    private Task<RpcTransactionResult> GetRpcTransactionResultSuccessful()
    {
        var rpcTransactionResult = new RpcTransactionResult
        {
            result = A.Dummy<string>()
        };
        return Task.FromResult(rpcTransactionResult);
    }

}