using API.Controllers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.ControllersTests;

public class StatusControllerTests
{
    private readonly StatusController _controller;

    public StatusControllerTests()
    {
        _controller = new StatusController();
    }

    [Fact]
    private void StatusController_Check_ReturnsOk()
    {
        // Arrange
        var response = "Online!";

        // Act
        var actionResult = _controller.Check();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as string;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));

        Assert.Equal(objectResultValue, response);
    }
}