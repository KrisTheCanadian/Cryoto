using System.Threading.Tasks;
using API.Models.Comments;
using API.Repository.Interfaces;
using API.Services;
using FakeItEasy;
using Xunit;

namespace API.Tests.ServicesTests;

public class CommentServiceTests
{
    private readonly ICommentRepository _commentRepository;
    private readonly CommentService _commentService;

    public CommentServiceTests()
    {
        _commentRepository = A.Fake<ICommentRepository>(x => x.Strict());
        _commentService = new CommentService(_commentRepository);
    }
    
    [Fact]
    public async void GetCommentByIdReturnsComment()
    {
        // Arrange
        var comment = A.Fake<CommentModel>();
        A.CallTo(() => _commentRepository.GetCommentById(A<string>.That.Matches(x => x == comment.Id))).Returns(comment);

        // Act
        var actionResult = await _commentService.GetCommentById(comment.Id);
        
        // Assert
        Assert.NotNull(actionResult);
        Assert.Equal(comment, actionResult);
        
        A.CallTo(() => _commentRepository.GetCommentById(A<string>.That.Matches(x => x == comment.Id))).MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async void DeleteCommentReturnsTrue()
    {
        // Arrange
        var comment = A.Fake<CommentModel>();
        A.CallTo(() => _commentRepository.DeleteComment(A<CommentModel>.That.Matches(x => x == comment))).Returns(true);

        // Act
        var actionResult = await _commentService.DeleteComment(comment);
        
        // Assert
        Assert.True(actionResult);
        
        A.CallTo(() => _commentRepository.DeleteComment(A<CommentModel>.That.Matches(x => x == comment))).MustHaveHappenedOnceExactly();
    }
}