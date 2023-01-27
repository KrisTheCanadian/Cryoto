using API.Crypto.Solana.SolanaObjects;
using API.Models.MarketPlace;
using API.Models.Transactions;
using API.Services.Interfaces;
using Newtonsoft.Json.Linq;

namespace API.Services;

public class MarketPlaceService : IMarketPlaceService
{
    private readonly ITransactionService _transactionService;
    private readonly ICryptoService _cryptoService;
    
    public MarketPlaceService(ITransactionService transactionService, ICryptoService cryptoService)
    {
        _transactionService = transactionService;
        _cryptoService = cryptoService;
    }
    public List<MarketPlaceItem>? GetAllItems()
    {
        var jsonString =  File.ReadAllText("scripts/data/MarketPlace/articles.json");
        return Newtonsoft.Json.JsonConvert.DeserializeObject<List<MarketPlaceItem>>(jsonString);
    }

    public MarketPlaceItem? GetItemById(string id)
    {
        var json =  JArray.Parse(File.ReadAllText("scripts/data/MarketPlace/articles.json"));
        var filteredJson = json.FirstOrDefault(o => (string)o["id"]! == id);
        return filteredJson?.ToObject<MarketPlaceItem>();
    }

    public async Task<RpcTransactionResult> BuyItemsAsync(string actorId, double amount)
    {
        var rpcTransactionResult = await _cryptoService.CreatePurchase(amount, actorId);
        if (rpcTransactionResult.error != null)
        {
            return rpcTransactionResult;
        }
        
        await _cryptoService.UpdateTokenBalance(-amount, actorId, "toSpend");
        
        _cryptoService.QueueTokenUpdate(new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { actorId } });

        await _transactionService.AddTransactionAsync(new TransactionModel("MarketPlace", "toAward", actorId,
            "toSpend", amount, "MarketPlacePurchase", DateTimeOffset.UtcNow));
        
        return rpcTransactionResult;
    }
}