using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

[ExcludeFromCodeCoverage]
public class WalletModel
{
    public WalletModel(string publicKey, string wallet, string oId, string walletType, double tokenBalance)
    {
        PublicKey = publicKey;
        Wallet = wallet;
        OId = oId;
        WalletType = walletType;
        TokenBalance = tokenBalance;
    }

    [Key] public string PublicKey { get; set; }
    public string Wallet { get; set; }
    public string WalletType { get; set; }
    public double TokenBalance { get; set; }
    [ForeignKey("UserProfileModel")] public string OId { get; set; }
}