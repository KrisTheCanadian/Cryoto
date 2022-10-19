using System.Text;
using Solnet.Wallet;
using Solnet.Wallet.Bip39;
using Solnet.KeyStore;

namespace API.Services.Crypto.Solana;

public class SolanaWallet
{
    /// <summary>
    /// Creates a new wallet
    /// </summary>
    /// <returns></returns>
    public static Wallet CreateWallet()
    {
        var wallet = new Wallet(WordCount.TwentyFour, WordList.English);
        return wallet;
    }
    
    /// <summary>
    /// Encrypts the mnemonic associated with the wallet in a web3 secret storage encrypted json data
    /// </summary>
    /// <param name="wallet">User's wallet</param>
    /// <param name="password">User's password</param>
    /// <returns>The encrypted json data</returns>
    public static string EncryptWallet(Wallet wallet, string password)
    {
        // Encrypt the mnemonic associated with the wallet
        var keystoreService = new SecretKeyStoreService();
        var mnemonicByteArray = Encoding.UTF8.GetBytes(wallet.Mnemonic.ToString());
        
        var encryptedKeystoreJson = keystoreService.EncryptAndGenerateDefaultKeyStoreAsJson(password, mnemonicByteArray,wallet.Account.PublicKey.Key);
        return encryptedKeystoreJson;
    }
    
    /// <summary>
    /// Decrypts the mnemonic associated with the wallet
    /// </summary>
    /// <param name="encryptedKeystoreJson">User's encrypted Mnemonic</param>
    /// <param name="password">User's password</param>
    /// <returns>The user's restored wallet</returns>
    public static Wallet DecryptWallet(string encryptedKeystoreJson, string password)
    {
        // Decrypts a web3 secret storage encrypted json data
        var keystoreService = new SecretKeyStoreService();
        var decryptedKeystore = keystoreService.DecryptKeyStoreFromJson(password, encryptedKeystoreJson);
        var mnemonicString = Encoding.UTF8.GetString(decryptedKeystore);

        // Restore the wallet from the restored mnemonic
        var restoredMnemonic = new Mnemonic(mnemonicString);
        var restoredWallet = new Wallet(restoredMnemonic);

        return restoredWallet;
    }
    
    /// <summary>
    /// Get a wallet object with associated mnemonic and passphrase (if needed)
    /// </summary>
    /// <param name="mnemonicString"></param>
    /// <param name="passphrase">optional</param>
    /// <returns>Wallet object</returns>
    public static Wallet RetrieveWallet(string mnemonicString, string passphrase = "")
    {
        // For wallets initiated with solana-keygen and have a passphrase
        if (!string.IsNullOrEmpty(passphrase))
            return new Wallet(mnemonicString, WordList.English, passphrase, SeedMode.Bip39);
        
        return new Wallet(mnemonicString, WordList.English);
    }
}