using System.Diagnostics.CodeAnalysis;
using API.Models.Address;

namespace API.Models.MarketPlace;

[ExcludeFromCodeCoverage]
public class Order
{
    public string Id { get; }
    public List<OrderItem> Items { get; }
    public int? Total { get; }
    public string? UserId { get; }
    public string Email { get; }
    public AddressCreateModel ShippingAddress { get; }
    public DateTimeOffset Timestamp { get; }

    public Order(string id, List<OrderItem> items, int total, string userId, string email, AddressCreateModel shippingAddress, DateTimeOffset timestamp)
    {
        Id = id;
        Total = total;
        UserId = userId;
        Items = items;
        Email = email;
        ShippingAddress = shippingAddress;
        Timestamp = timestamp;
    }
}