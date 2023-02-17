using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Models.Comments;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Xunit;

namespace API.Tests.ControllersTests;

public class CommentControllerTests
{
    private readonly ICommentService _commentService; 
    private readonly CommentController _controller;
    private readonly IHttpContextAccessor _contextAccessor;
    
    public CommentControllerTests()
    {
        _commentService = A.Fake<ICommentService>(x => x.Strict());
        _contextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new CommentController(_commentService, _contextAccessor);
    }
    
    [Fact]
    public async void CommentController_GetById_ReturnsCommentModel()
    {
        //Arrange
        var commentModel = A.Fake<CommentModel>();
        A.CallTo(() => _commentService.GetCommentById(A<string>.That.Matches(x => x == commentModel.Id))).Returns(commentModel);
        
        //Act
        var actionResult = await _controller.GetById(commentModel.Id);
        
        //Assert
        A.CallTo(() => _commentService.GetCommentById(A<string>.That.Matches(x => x == commentModel.Id))).MustHaveHappenedOnceExactly();
        actionResult.Should().NotBeNull();
        var result = actionResult.Result as OkObjectResult;
        result.Should().NotBeNull();
        var resultValue = result!.Value as CommentModel;
        
        Assert.Matches(resultValue!.Id, commentModel.Id);
    }
    
    [Fact]
    public async void CommentController_Delete_ReturnsOk()
    {
        //Arrange
        const string id = "oidValue";
        
        var contextAccessor = A.Fake<IHttpContextAccessor>();
        var identity = new ClaimsIdentity(new[] { new Claim(ClaimConstants.ObjectId, id) });
        
        var controller = new CommentController(_commentService, contextAccessor)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            },
            HttpContext = { User = new ClaimsPrincipal() }
        };

        var claims = new ClaimsIdentity();
        claims.AddClaim(new Claim(ClaimConstants.ObjectId, id));
        claims.AddClaim(new Claim("oid", id));
        claims.AddClaim(new Claim("name", "namValue"));
        claims.AddClaim(new Claim("preferred_username", "email"));
        claims.AddClaim(new Claim("roles", "Admin"));
        controller.HttpContext.User.AddIdentity(claims);
        
        var commentModel = A.Fake<CommentModel>();
        
        var guid = Guid.NewGuid();
        commentModel.Id = guid.ToString();
        
        commentModel.Author = id;
        A.CallTo(() => contextAccessor.HttpContext).Returns(A.Fake<HttpContext>());
        A.CallTo(() => _commentService.GetCommentById(A<string>.That.Matches(x => x == commentModel.Id))).Returns(commentModel);
        A.CallTo(() => _commentService.DeleteComment(A<CommentModel>.That.Matches(x => x == commentModel))).Returns(Task.FromResult(true));
        A.CallTo(() => contextAccessor.HttpContext!.User.Identity).Returns(identity);
        
        //Act
        var actionResult = await controller.Delete(guid);
        
        //Assert
        actionResult.Should().NotBeNull();
        A.CallTo(() => _commentService.GetCommentById(A<string>.That.Matches(x => x == commentModel.Id))).MustHaveHappenedOnceExactly();
    }
}