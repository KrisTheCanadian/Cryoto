using System.Diagnostics.CodeAnalysis;

namespace API.Models.MarketPlace;

[ExcludeFromCodeCoverage]
public class OrderItem
{
    public OrderItem(string id, int quantity, string? size = null)
    {
        Id = id;
        Quantity = quantity;
        Size = size;
    }

    public string Id { get; }
    public int Quantity { get; }
    public string? Size { get; }
}