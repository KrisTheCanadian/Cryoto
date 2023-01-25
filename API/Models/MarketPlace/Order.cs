using System.Diagnostics.CodeAnalysis;

namespace API.Models.MarketPlace;

[ExcludeFromCodeCoverage]
public class Order
{
    public string? Id { get; }
    public List<OrderItem> Items { get; }
    public int? Total { get; }
    public string? UserId { get; }
    public string Email { get; }
    public string Address { get; }
    public DateTimeOffset? Timestamp { get; set; }

    public Order(List<OrderItem> items, int total, string userId, string email, string address, DateTimeOffset timestamp)
    {
        Id = Guid.NewGuid().ToString();
        Total = total;
        UserId = userId;
        Items = items;
        Email = email;
        Address = address;
        Timestamp = timestamp;
    }
}