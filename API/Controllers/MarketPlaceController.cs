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
    private readonly string _actorId;

    public MarketPlaceController(IMarketPlaceService marketPlaceService, ICryptoService cryptoService,
        IHttpContextAccessor contextAccessor)
    {
        _marketPlaceService = marketPlaceService;
        _cryptoService = cryptoService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _actorId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpGet]
    public ActionResult<List<MarketPlaceItem>> GetAllItems()
    {
        return Ok(_marketPlaceService.GetAllItems());
    }

    [HttpGet]
    public ActionResult<MarketPlaceItem> GetItemById(string id)
    {
        var item = _marketPlaceService.GetItemById(id);
        if (item == null)
        {
            return NotFound("Item could not be found");
        }

        return Ok(item);
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

        ordersList.Add(new Order(order.Items, subtotal, _actorId, order.Email, order.Address, DateTimeOffset.UtcNow));

        jsonData = JsonConvert.SerializeObject(ordersList);
        System.IO.File.WriteAllText(filePath, jsonData);

        return Ok(order);
    }
}