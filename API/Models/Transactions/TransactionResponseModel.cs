using System.Diagnostics.CodeAnalysis;

namespace API.Models.Transactions;

[ExcludeFromCodeCoverage]

public class TransactionResponseModel
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public string WalletType { get; set; }
    public double TokenAmount { get; set; }
    public string Description { get; set; }
    public DateTimeOffset Timestamp { get; set; }
    
    public TransactionResponseModel(string id, string oId, string walletType, double tokenAmount, string description, DateTimeOffset timestamp)
    {
        Id = id;
        UserId = oId;
        WalletType = walletType;
        TokenAmount = tokenAmount;
        Description = description;
        Timestamp = timestamp;
    }
}