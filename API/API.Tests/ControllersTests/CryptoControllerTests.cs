using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Users;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.ControllersTests;

public class CryptoControllerTests
{
    private readonly ICryptoService _cryptoService;
    private readonly CryptoController _controller;


    public CryptoControllerTests()
    {
        _cryptoService = A.Fake<ICryptoService>();
        var contextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new CryptoController(_cryptoService, contextAccessor);
    }

    [Fact]
    public async void CryptoController_PostTransaction_ReturnsOK()
    {
        //Arrange
        var rpcTransactionResult = GetRpcTransactionResultSuccessful();
        var userProfileModelList = GetUserProfileModelList();
        var senderOId = userProfileModelList.Result[0].OId;
        var receiverOId = userProfileModelList.Result[1].OId;
        var amount = A.Dummy<double>();
        A.CallTo(() => _cryptoService.SendTokens(amount, A<string>._, A<string>._))!
            .Returns(rpcTransactionResult);
        A.CallTo(() => _cryptoService.UpdateTokenBalance((-amount), senderOId, "toAward"))
            .Returns(true);
        A.CallTo(() => _cryptoService.UpdateTokenBalance(amount, receiverOId, "toSpend"))
            .Returns(true);

        //Act
        var actionResult = await _controller.PostTransaction(amount, receiverOId);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult!.Value as RpcTransactionResult;

        //Assert
        A.CallTo(() => _cryptoService.SendTokens(A<double>._, A<string>._, A<string>._))
            .MustHaveHappenedOnceExactly();
        A.CallTo(() => _cryptoService.UpdateTokenBalance(A<double>._, A<string>._, A<string>._))
            .MustHaveHappenedTwiceExactly();

        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<OkObjectResult>();
        objectResultValue?.result.Should().Be(rpcTransactionResult.Result.result);
        objectResultValue?.error.Should().BeNull();
    }

    [Fact]
    public async void CryptoController_PostTransaction_ReturnsBadRequest()
    {
        //Arrange
        var rpcTransactionResultError = GetRpcTransactionResultError();
        var userProfileModelList = GetUserProfileModelList();
        var receiverOId = userProfileModelList.Result[1].OId;
        var amount = A.Dummy<double>();
        A.CallTo(() => _cryptoService.SendTokens(amount, A<string>._, A<string>._))!
            .Returns(rpcTransactionResultError);

        //Act
        var actionResult = await _controller.PostTransaction(amount, receiverOId);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value;

        //Assert
        A.CallTo(() => _cryptoService.SendTokens(A<double>._, A<string>._, A<string>._))
            .MustHaveHappenedOnceExactly();

        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<BadRequestObjectResult>();
        objectResultValue.Should().BeOfType<RpcTransactionResult.Error>();
    }

    [Fact]
    public async void CryptoController_PurchaseTransaction_ReturnsOK()
    {
        //Arrange
        var rpcTransactionResult = GetRpcTransactionResultSuccessful();
        var amount = A.Dummy<double>();

        A.CallTo(() => _cryptoService.CreatePurchase(A<double>._, A<string>._))
            .Returns(rpcTransactionResult);
        A.CallTo(() => _cryptoService.UpdateTokenBalance(A<double>._, A<string>._, "toSpend"))
            .Returns(true);

        //Act
        var actionResult = await _controller.PurchaseTransaction(amount);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult!.Value as RpcTransactionResult;


        //Assert
        A.CallTo(() => _cryptoService.CreatePurchase(A<double>._, A<string>._))
            .MustHaveHappenedOnceExactly();
        A.CallTo(() => _cryptoService.UpdateTokenBalance(A<double>._, A<string>._, "toSpend"))
            .MustHaveHappenedOnceExactly();

        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<OkObjectResult>();
        objectResultValue?.result.Should().Be(rpcTransactionResult.Result.result);
        objectResultValue?.error.Should().BeNull();
    }

    [Fact]
    public async void CryptoController_PurchaseTransaction_ReturnsBadRequest()
    {
        //Arrange
        var rpcTransactionResultError = GetRpcTransactionResultError();
        var amount = A.Dummy<double>();

        A.CallTo(() => _cryptoService.CreatePurchase(A<double>._, A<string>._))
            .Returns(rpcTransactionResultError);

        //Act
        var actionResult = await _controller.PurchaseTransaction(amount);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value;

        //Assert
        A.CallTo(() => _cryptoService.CreatePurchase(A<double>._, A<string>._))
            .MustHaveHappenedOnceExactly();

        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<BadRequestObjectResult>();
        objectResultValue.Should().BeOfType<RpcTransactionResult.Error>();
    }


    [Fact]
    public async void CryptoController_GetTokenBalance_ReturnsOK()
    {
        //Arrange
        var userProfileModelList = GetUserProfileModelList();
        var oId = userProfileModelList.Result[0].OId;
        var balance = A.Dummy<double>();
        A.CallTo(() => _cryptoService.GetTokenBalanceAsync(oId, "toAward",A<ClaimsIdentity>._)).Returns(balance);

        //Act
        var actionResult = await _controller.GetTokenBalance("toAward");
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<OkObjectResult>();
        objectResultValue.Should().BeOfType<double>();
        objectResultValue.Should().Be(balance);
    }

    private Task<List<UserProfileModel>> GetUserProfileModelList()
    {
        var roles1 = new[] { "roles1" };
        var roles2 = new[] { "roles1" };
        var userProfileModelList = new List<UserProfileModel>
        {
            new("oid1", "name1", "email1", "en1", roles1),
            new("oid2", "name2", "email2", "en2", roles2)
        };
        return Task.FromResult(userProfileModelList);
    }

    private Task<RpcTransactionResult> GetRpcTransactionResultError()
    {
        var rpcTransactionResult = new RpcTransactionResult
        {
            error = new RpcTransactionResult.Error()
        };
        return Task.FromResult(rpcTransactionResult);
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