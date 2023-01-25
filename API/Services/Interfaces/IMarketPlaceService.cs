using API.Crypto.Solana.SolanaObjects;
using API.Models.MarketPlace;

namespace API.Services.Interfaces;

public interface IMarketPlaceService
{
    public List<MarketPlaceItem>? GetAllItems();
    public MarketPlaceItem? GetItemById(string id);
    public Task<RpcTransactionResult> BuyItemsAsync(string actorId, double amount);
}