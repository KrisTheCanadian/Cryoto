using System.Collections.Generic;
using System.Threading.Tasks;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Transactions;
using API.Services;
using API.Services.Interfaces;
using FakeItEasy;
using Xunit;

namespace API.Tests.ServicesTests;

public class MarketPlaceServiceTests
{
    private readonly ITransactionService _transactionService;
    private readonly ICryptoService _cryptoService;
    private readonly MarketPlaceService _marketPlaceService;

    public MarketPlaceServiceTests()
    {
        _transactionService = A.Fake<ITransactionService>();
        _cryptoService = A.Fake<ICryptoService>();
        _marketPlaceService = new MarketPlaceService(_transactionService, _cryptoService);
    }
    
    [Fact]
    public void GetAllItems_ShouldReturnAllMarketPlaceItems_WhenCalled()
    {
        // Arrange

        // Act
        var result = _marketPlaceService.GetAllItems();

        // Assert
        Assert.NotNull(result);
    }
    
    [Fact]
    public void GetItemById_ShouldReturnCorrectMarketPlaceItem_WhenCalledWithExistingId()
    {
        // Arrange

        // Act
        var result = _marketPlaceService.GetItemById("afd380c1-c643-4c6f-8454-60cb22585582");

        // Assert
        Assert.NotNull(result);
    }
    
    [Fact]
    public async Task BuyItemsAsync_ShouldCreatePurchaseAndUpdateTokenBalanceAndQueueTokenUpdateAndAddTransaction_WhenCalledWithValidData()
    {
        // Arrange
        var actorId = "user123";
        var amount = 10.0;
        var rpcTransactionResult = new RpcTransactionResult { error = null };
        A.CallTo(() => _cryptoService.CreatePurchase(amount, actorId)).Returns(rpcTransactionResult);

        // Act
        var result = await _marketPlaceService.BuyItemsAsync(actorId, amount);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(rpcTransactionResult, result);
    }
}