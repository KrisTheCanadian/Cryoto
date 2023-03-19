using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Transactions;
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
    private readonly CryptoController _controller;
    private readonly ICryptoService _cryptoService;
    private readonly ITransactionService _transactionService;


    public CryptoControllerTests()
    {
        _cryptoService = A.Fake<ICryptoService>();
        _transactionService = A.Fake<ITransactionService>();
        var contextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new CryptoController(_cryptoService, _transactionService, contextAccessor);
    }

    [Fact]
    public async Task CryptoController_SelfTransferTokens_ReturnsOK()
    {
        //Arrange
        var rpcTransactionResult = GetRpcTransactionResultSuccessful();
        var userProfileModelList = GetUserProfileModelList();
        var senderOId = userProfileModelList.Result[0].OId;
        var receiverOId = userProfileModelList.Result[0].OId;
        var amount = A.Dummy<double>();
        A.CallTo(() => _cryptoService.SelfTransferTokens(amount, A<string>._))
            .Returns(rpcTransactionResult);
        A.CallTo(() => _cryptoService.UpdateTokenBalance(-amount, senderOId, "toSpend"))
            .Returns(true);
        A.CallTo(() => _cryptoService.UpdateTokenBalance(amount, receiverOId, "toAward"))
            .Returns(true);

        //Act
        var actionResult = await _controller.SelfTransferTokens(amount);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult!.Value as RpcTransactionResult;

        //Assert
        A.CallTo(() => _cryptoService.SelfTransferTokens(A<double>._, A<string>._))
            .MustHaveHappenedOnceExactly();
        A.CallTo(() => _cryptoService.UpdateTokenBalance(A<double>._, A<string>._, A<string>._))
            .MustHaveHappenedTwiceExactly();
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._))
            .MustHaveHappenedTwiceExactly();

        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<OkObjectResult>();
        objectResultValue?.result.Should().Be(rpcTransactionResult.Result.result);
        objectResultValue?.error.Should().BeNull();
    }

    [Fact]
    public async Task CryptoController_SelfTransferTokens_ReturnsBadRequest()
    {
        //Arrange
        var rpcTransactionResult = GetRpcTransactionResultError();
        var amount = A.Dummy<double>();
        A.CallTo(() => _cryptoService.SelfTransferTokens(amount, A<string>._))
            .Returns(rpcTransactionResult);

        //Act
        var actionResult = await _controller.SelfTransferTokens(amount);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult!.Value;

        //Assert
        A.CallTo(() => _cryptoService.SelfTransferTokens(A<double>._, A<string>._))
            .MustHaveHappenedOnceExactly();

        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<BadRequestObjectResult>();
        objectResultValue.Should().BeOfType<RpcTransactionResult.Error>();
    }


    [Fact]
    public async Task CryptoController_GetTokenBalance_ReturnsOK()
    {
        //Arrange
        var userWalletsModel = GetFakeUserWalletsModel();
        A.CallTo(() => _cryptoService.GetWalletsBalanceAsync(A<string>._, A<ClaimsIdentity>._))
            .Returns(userWalletsModel);

        //Act
        var actionResult = await _controller.GetTokenBalance();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType<OkObjectResult>();
        objectResultValue.Should().BeOfType<UserWalletsModel>();
        objectResultValue.Should().Be(userWalletsModel);
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

    private UserWalletsModel GetFakeUserWalletsModel()
    {
        return new UserWalletsModel(
            50.50,
            25
        );
    }
}