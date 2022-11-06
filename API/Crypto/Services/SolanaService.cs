using API.Crypto.Services.Interfaces;
using API.Crypto.Solana;
using API.Crypto.Solana.SolanaObjects;
using Solnet.Wallet;

namespace API.Crypto.Services;

public class SolanaService : ISolanaService
{
    public Wallet CreateWallet()
    {
        return SolanaWallet.CreateWallet();
    }

    public string EncryptWallet(Wallet wallet, string password)
    {
        return SolanaWallet.EncryptWallet(wallet, password);
    }

    public Wallet DecryptWallet(string encryptedKeystoreJson, string password, string passphrase = "")
    {
        return SolanaWallet.DecryptWallet(encryptedKeystoreJson, password, passphrase);
    }

    public Wallet GetWallet(string mnemonicString, string passphrase = "")
    {
        return SolanaWallet.RetrieveWallet(mnemonicString, passphrase);
    }

    public PublicKey GetPublicKeyFromString(string pb)
    {
        return SolanaWallet.GetPublicKeyFromString(pb);
    }

    public RpcTransactionResult SendTokens(double amount, Wallet sender, Wallet feePayer, PublicKey receiver,
        string tokenAddress)
    {
        return SolanaTransactions.SendTokens(amount, sender, feePayer, receiver, tokenAddress);
    }

    public double GetTokenBalance(PublicKey pb, string tokenAddress)
    {
        return SolanaTransactions.GetTokenWalletBalance(pb, tokenAddress);
    }
}