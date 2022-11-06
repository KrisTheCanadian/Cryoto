using API.Crypto.Solana.SolanaObjects;
using Solnet.Wallet;

namespace API.Crypto.Services.Interfaces;

public interface ISolanaService
{
    public Wallet CreateWallet();
    public string EncryptWallet(Wallet wallet, string password);
    public Wallet DecryptWallet(string encryptedJsonWallet, string password, string passphrase = "");
    public Wallet GetWallet(string mnemonic, string passphrase = "");
    public PublicKey GetPublicKeyFromString(string pb);
    public RpcTransactionResult SendTokens(double amount, Wallet sender, Wallet feePayer, PublicKey receiver,
        string tokenAddress);
    public double GetTokenBalance(PublicKey pb, string tokenAddress);
}