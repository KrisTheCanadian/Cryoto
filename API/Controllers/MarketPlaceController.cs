using System.Security.Claims;
using API.Models.MarketPlace;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;
using Newtonsoft.Json;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class MarketPlaceController : ControllerBase
{
    private readonly IMarketPlaceService _marketPlaceService;
    private readonly ICryptoService _cryptoService;
    private readonly INotificationService _notificationService;
    private readonly string _actorId;

    public MarketPlaceController(IMarketPlaceService marketPlaceService, ICryptoService cryptoService,  INotificationService notificationService,
        IHttpContextAccessor contextAccessor)
    {
        _marketPlaceService = marketPlaceService;
        _cryptoService = cryptoService;
        _notificationService = notificationService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpGet]
    public ActionResult<List<MarketPlaceItem>> GetAllItems()
    {
        return Ok(_marketPlaceService.GetAllItems());
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CompletePurchaseAsync(Order order)
    {
        var actorBalance = _cryptoService.GetTokenBalanceAsync(_actorId, "toSpend");
        var subtotal = 0;

        foreach (var product in order.Items)
        {
            var marketPlaceItem = _marketPlaceService.GetItemById(product.Id);

            if (marketPlaceItem?.Availabilities == null || marketPlaceItem?.Availabilities < product.Quantity)
                return BadRequest("Item not available");

            subtotal += product.Quantity * marketPlaceItem!.Points;
        }

        if (subtotal > actorBalance)
            return BadRequest("Not enough tokens to purchase items");

        var purchaseResult = await _marketPlaceService.BuyItemsAsync(_actorId, subtotal);
        if (purchaseResult.error != null)
            return BadRequest(purchaseResult.error);

        // send order details to orders log
        var filePath = "scripts/data/MarketPlace/orders.json";
        var jsonData = System.IO.File.ReadAllText(filePath);

        var ordersList = JsonConvert.DeserializeObject<List<Order>>(jsonData)
                         ?? new List<Order>();

        ordersList.Add(new Order(order.Id, order.Items, subtotal, _actorId, order.Email, order.ShippingAddress, order.Timestamp));

        jsonData = JsonConvert.SerializeObject(ordersList);
        System.IO.File.WriteAllText(filePath, jsonData);
        
        // send email confirmation
        var subject = "You have successfully placed an order!";
        var htmlContent = "<h1>We got your order!" + "</h1>" +
                          "<h3>" + "Order #" + order.Id + "<h3><br>" +
                          "<h3>" + "<u>Shipping Address</u>" + "<h3>" +
                          
                          "<p>" + order.ShippingAddress.StreetNumber + " " + order.ShippingAddress.Street + " " + order.ShippingAddress.Apartment + "</p>" +
                          "<p>" + order.ShippingAddress.City + ", " + order.ShippingAddress.Province + " " + order.ShippingAddress.Country + "</p>" +
                          "<p>" + order.ShippingAddress.PostalCode + "</p><br>" +
                          
                          "<p>" + "You used " + subtotal + " coins for this purchase." + "<p>" +
                          
                          "<p>" + "The shipping provider will send you more details on when you can expect your delivery " +
                          "as well as provide you with tracking information." + "</p>";

        await _notificationService.SendEmailAsync(order.Email, subject, htmlContent, true);

        return Ok(order);
    }
}