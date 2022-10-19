using API.Services.Crypto.Solana.SolanaObjects;
using Solnet.Wallet;

namespace API.Services.Crypto;

public interface ICryptoService
{
    public Wallet CreateWallet();
    public string EncryptWallet(Wallet wallet, string password);
    public Wallet DecryptWallet(string encryptedJsonWallet, string password);
    public Wallet GetWallet(string mnemonic, string passphrase);
    public RpcTransactionResult SendTokens(double amount, Wallet sender, Wallet feePayer, PublicKey receiver,
        string tokenAddress);
}
