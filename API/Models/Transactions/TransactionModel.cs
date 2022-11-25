using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace API.Models.Transactions;

[ExcludeFromCodeCoverage]

public class TransactionModel
{
    [Key] public string Id { get; set; }
    public string ReceiverOId { get; set; }
    public string ReceiverWalletType { get; set; }
    public string SenderOId { get; set; }
    public string SenderWalletType { get; set; }
    public double TokenAmount { get; set; }
    public string Type { get; set; }
    public DateTimeOffset Timestamp { get; set; }
    
    public TransactionModel(string receiverOId, string receiverWalletType, string senderOId,string senderWalletType, double tokenAmount, string type, DateTimeOffset timestamp)
    {
        Id = Guid.NewGuid().ToString();
        ReceiverOId = receiverOId;
        ReceiverWalletType = receiverWalletType;
        SenderOId = senderOId;
        SenderWalletType = senderWalletType;
        TokenAmount = tokenAmount;
        Type = type;
        Timestamp = timestamp;
    }
}