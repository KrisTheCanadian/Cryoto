using API.Services.Crypto.Solana.SolanaObjects;
using Solnet.Wallet;


namespace API.Services.Crypto;

public class SolanaCryptoService : ICryptoService
{
    public Wallet CreateWallet()
    {
        return Solana.SolanaWallet.CreateWallet();
    }
    
    public string EncryptWallet(Wallet wallet, string password)
    {
        return Solana.SolanaWallet.EncryptWallet(wallet, password);
    }

    public Wallet DecryptWallet(string encryptedKeystoreJson, string password)
    {
        return Solana.SolanaWallet.DecryptWallet(encryptedKeystoreJson,password);
    }
    
    public Wallet GetWallet(string mnemonicString, string passphrase = "")
    {
        return Solana.SolanaWallet.RetrieveWallet(mnemonicString,passphrase);
    }

    public RpcTransactionResult SendTokens(double amount, Wallet sender, Wallet feePayer, PublicKey receiver, string tokenAddress)
    {
        return Solana.SolanaTransactions.SendTokens(amount,sender,feePayer,receiver, tokenAddress);
    }
    
    public double GetTokenBalance(PublicKey pb, string tokenAddress)
    {
        return Solana.SolanaTransactions.GetTokenWalletBalance(pb, tokenAddress);
    }
   
}