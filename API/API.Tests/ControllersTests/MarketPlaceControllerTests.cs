using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Address;
using API.Models.MarketPlace;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.ControllersTests;

public class MarketPlaceControllerTests
{
    private readonly IMarketPlaceService _marketPlaceService;
    private readonly ICryptoService _cryptoService;
    private readonly INotificationService _notificationService;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly MarketPlaceController _controller;

    public MarketPlaceControllerTests()
    {
        _marketPlaceService = A.Fake<IMarketPlaceService>();
        _cryptoService = A.Fake<ICryptoService>();
        _notificationService = A.Fake<INotificationService>();
        _contextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new MarketPlaceController(_marketPlaceService, _cryptoService, _notificationService, _contextAccessor);
    }
    private List<MarketPlaceItem> GetFakeMarketPlaceItems()
    {
        List<MarketPlaceItem> items = new List<MarketPlaceItem>
        {
            new MarketPlaceItem(
                "afd380c1-c643-4c6f-8454-60cb22585582",
                "Amazon 10$ Gift Card",
                "Carte-cadeau Amazon de 10$",
                "Gift Card",
                "Carte-cadeau",
                "Amazon",
                "https://m.media-amazon.com/images/G/15/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_ca-main._CB468775011_.png",
                100,
                100,
                "Electronic gift cards will be sent to the recipient&apos;s email when order is processed.",
                "Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée."
            ),
            new MarketPlaceItem(
                "26b80e6e-9690-4748-b6ef-869d72b5e4ec",
                "Amazon 50$ Gift Card",
                "Carte-cadeau Amazon de 50$",
                "Gift Card",
                "Carte-cadeau",
                "Amazon",
                "https://m.media-amazon.com/images/G/15/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_ca-main._CB468775011_.png",
                500,
                100,
                "Electronic gift cards will be sent to the recipient&apos;s email when order is processed.",
                "Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée."
            )
        };

        return items;
    }

    private MarketPlaceItem GetFakeMarketPlaceItem()
    {
        return new MarketPlaceItem(
            "26b80e6e-9690-4748-b6ef-869d72b5e4ec",
            "Amazon 50$ Gift Card",
            "Carte-cadeau Amazon de 50$",
            "Gift Card",
            "Carte-cadeau",
            "Amazon",
            "https://m.media-amazon.com/images/G/15/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_ca-main._CB468775011_.png",
            5,
            100,
            "Electronic gift cards will be sent to the recipient&apos;s email when order is processed.",
            "Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée."
        );

    }
    
    private Order GetFakeOrder()
    {
        List<OrderItem> orderItems = new List<OrderItem>
            { new ("26b80e6e-9690-4748-b6ef-869d72b5e4ec", 1), new ("afd380c1-c643-4c6f-8454-60cb22585582", 1) };
        
        var mockAddress = new AddressCreateModel("1", "20", "Test Street", "Test City", "Test Province",
            "Test Country", "Test Postal Code");
        
        return new Order("123456",orderItems, 50, "userID", "test@test.com", mockAddress, DateTimeOffset.Now);
    }
    
    private Task<RpcTransactionResult> GetRpcTransactionResultSuccessful()
    {
        var rpcTransactionResult = new RpcTransactionResult
        {
            result = A.Dummy<string>()
        };
        return Task.FromResult(rpcTransactionResult);
    }
    
    [Fact]
    public void MarketPlaceController_GetAllItems_ReturnsOK()
    {
        // Arrange
        var items = GetFakeMarketPlaceItems();
        A.CallTo(() => _marketPlaceService.GetAllItems()).Returns(items);
        
        // Act
        var actionResult = _controller.GetAllItems();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as List<MarketPlaceItem>;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        Assert.Equal(items, objectResultValue);
    }

    [Fact]
    public async void MarketPlaceController_CompletePurchase_ReturnsOK()
    {
        // Arrange
        var order = GetFakeOrder();
        var item = GetFakeMarketPlaceItem();
        var rpcTransactionSuccess = GetRpcTransactionResultSuccessful();
        A.CallTo(() => _cryptoService.GetTokenBalanceAsync(A<string>.Ignored, A<string>.Ignored)).Returns(200);
        A.CallTo(() => _marketPlaceService.BuyItemsAsync(A<string>.Ignored, A<double>.Ignored)).Returns(rpcTransactionSuccess);
        A.CallTo(() => _marketPlaceService.GetItemById(A<string>.Ignored)).Returns(item);

        // Act
        var actionResult = await _controller.CompletePurchaseAsync(order);

        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as Order;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        
        Assert.Equal(order.Email, objectResultValue?.Email);
        Assert.Equal(order.UserId, objectResultValue?.UserId);
        Assert.Equal(order.Items, objectResultValue?.Items);
        Assert.Equal(order.Total, objectResultValue?.Total);
        Assert.Equal(order.ShippingAddress, objectResultValue?.ShippingAddress);
        Assert.Equal(order.Timestamp, objectResultValue?.Timestamp);
    }
}