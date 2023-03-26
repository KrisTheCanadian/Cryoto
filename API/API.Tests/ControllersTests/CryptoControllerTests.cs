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
using Microsoft.Identity.Web;
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
    
    [Fact]
    public async Task PostTokens_Returns_BadRequest_When_RpcTransactionResult_Has_Error()
    {
        // Arrange
        var amount = 10.0;
        var walletType = "TestWallet";
        var expectedError = new RpcTransactionResult.Error { message = "Error Message" };

        var cryptoService = A.Fake<ICryptoService>();
        var transactionService = A.Fake<ITransactionService>();

        var rpcTransactionResult = new RpcTransactionResult { error =  expectedError};
        A.CallTo(() => cryptoService.AddTokensAsync(amount, A<string>._, walletType)).Returns(rpcTransactionResult);

        var controller = new CryptoController(cryptoService, transactionService, A.Fake<IHttpContextAccessor>())
        {
            ControllerContext = new ControllerContext { HttpContext = A.Fake<HttpContext>() }
        };

        // Act
        var result = await controller.PostTokens(amount, walletType);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal(expectedError, badRequestResult.Value);
    }
    
    [Fact]
    public async Task PostTokens_Returns_Ok_When_RpcTransactionResult_Is_Successful()
    {
        // Arrange
        var amount = 10.0;
        var walletType = "TestWallet";

        var cryptoService = A.Fake<ICryptoService>();
        var transactionService = A.Fake<ITransactionService>();

        var rpcTransactionResult = new RpcTransactionResult { result = "Success" };
        A.CallTo(() => cryptoService.AddTokensAsync(amount, A<string>._, walletType)).Returns(rpcTransactionResult);

        var controller = new CryptoController(cryptoService, transactionService, A.Fake<IHttpContextAccessor>())
        {
            ControllerContext = new ControllerContext { HttpContext = A.Fake<HttpContext>() }
        };

        // Act
        var result = await controller.PostTokens(amount, walletType);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(rpcTransactionResult, okResult.Value);
    }
    
    [Fact]
    public async Task PostTokens_Adds_Transaction()
    {
        // Arrange
        var amount = 10.0;
        var walletType = "TestWallet";
        var oId = "123";

        var cryptoService = A.Fake<ICryptoService>();
        var transactionService = A.Fake<ITransactionService>();

        var rpcTransactionResult = new RpcTransactionResult { result = "Success" };
        A.CallTo(() => cryptoService.AddTokensAsync(amount, oId, walletType)).Returns(rpcTransactionResult);

        var controller = new CryptoController(cryptoService, transactionService, A.Fake<IHttpContextAccessor>())
        {
            ControllerContext = new ControllerContext { HttpContext = A.Fake<HttpContext>() }
        };

        // Act
        await controller.PostTokens(amount, walletType);

        // Assert
        A.CallTo(() => transactionService.AddTransactionAsync(A<TransactionModel>._)).MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async Task GetTokenBalance_Returns_Ok_With_UserWalletsModel()
    {
        // Arrange
        var oId = "123";
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimConstants.ObjectId, oId),
            new Claim(ClaimTypes.Role, "User")
        });

        var expectedWallets = new UserWalletsModel(5, 5);

        var cryptoService = A.Fake<ICryptoService>();
        var transactionService = A.Fake<ITransactionService>();

        A.CallTo(() => cryptoService.GetWalletsBalanceAsync(oId, identity)).Returns(expectedWallets);

        var controller = new CryptoController(cryptoService, transactionService, A.Fake<IHttpContextAccessor>())
        {
            ControllerContext = new ControllerContext { HttpContext = A.Fake<HttpContext>() },
            OId = oId,
            Identity = identity
        };

        // Act
        var result = await controller.GetTokenBalance();

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
        var okResult = result.Result as OkObjectResult;
        Assert.Equal(expectedWallets, okResult?.Value);
    }
    
    [Fact]
    public void InitiateSolBalanceCheck_Returns_Ok()
    {
        // Arrange
        var cryptoService = A.Fake<ICryptoService>();
        var transactionService = A.Fake<ITransactionService>();

        var controller = new CryptoController(cryptoService, transactionService, A.Fake<IHttpContextAccessor>())
        {
            ControllerContext = new ControllerContext { HttpContext = A.Fake<HttpContext>() }
        };

        // Act
        var result = controller.InitiateSolBalanceCheck();

        // Assert
        Assert.IsType<OkResult>(result);
        A.CallTo(() => cryptoService.QueueSolUpdateAsync(A<List<List<string>>>.That.Matches(
            queue => queue[0][0] == "checkAdminBalanceQueue" && queue[1][0] == "null"))).MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async Task InitiateMonthlyTokensGift_Returns_Ok()
    {
        // Arrange
        var oId = "123";
        var cryptoService = A.Fake<ICryptoService>();
        var transactionService = A.Fake<ITransactionService>();

        var controller = new CryptoController(cryptoService, transactionService, A.Fake<IHttpContextAccessor>())
        {
            ControllerContext = new ControllerContext { HttpContext = A.Fake<HttpContext>() }
        };

        // Act
        var result = await controller.InitiateMonthlyTokensGift(oId);

        // Assert
        Assert.IsType<OkResult>(result);
        A.CallTo(() => cryptoService.SendMonthlyTokenBasedOnRole(oId)).MustHaveHappenedOnceExactly();
        A.CallTo(() => cryptoService.QueueMonthlyTokensGiftAsync(A<List<List<string>>>.That.Matches(
            queue => queue[0][0] == "monthlyTokenQueue" && queue[1][0] == oId))).MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public void InitiateAnniversaryBonusGifting_Returns_Ok()
    {
        // Arrange
        var cryptoService = A.Fake<ICryptoService>();
        var transactionService = A.Fake<ITransactionService>();

        var controller = new CryptoController(cryptoService, transactionService, A.Fake<IHttpContextAccessor>())
        {
            ControllerContext = new ControllerContext { HttpContext = A.Fake<HttpContext>() }
        };

        // Act
        var result = controller.InitiateAnniversaryBonusGifting();

        // Assert
        Assert.IsType<OkResult>(result);
        A.CallTo(() => cryptoService.QueueAnniversaryBonusAsync(A<List<List<string>>>.That.Matches(
            queue => queue[0][0] == "anniversaryBonusQueue" && queue[1][0] == "null"))).MustHaveHappenedOnceExactly();
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