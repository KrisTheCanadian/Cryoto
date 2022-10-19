using System;
using API.Services.Crypto;
using Solnet.KeyStore.Exceptions;
using Solnet.Wallet;
using Solnet.Rpc;
using Solnet.Wallet.Bip39;
using Xunit;
using FakeItEasy;
using Solnet.Rpc.Models;

namespace API.Tests.Crypto;

public class SolanaServiceTests
{
    [Fact]
    public void CreatingWalletTest_ReturnsAWallet()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();

        // Act
        var wallet = solanaCryptoService.CreateWallet();
        
        // Assert
        Assert.NotNull(wallet);
        Assert.NotNull(wallet.Account.PublicKey);
        Assert.NotNull(wallet.Account.PrivateKey);
        Assert.NotNull(wallet.Mnemonic);
    }
    
    [Theory]
    [InlineData("5uv#jbHKrSDHiu&Sh")]
    [InlineData("")]
    public void EncryptWalletTest_ReturnsEncryptedJson(string password)
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var wallet = solanaCryptoService.CreateWallet();
        
        // Act
        var json = solanaCryptoService.EncryptWallet(wallet, password);
        
        // Assert
        Assert.NotNull(json);
    }
    
    [Fact]
    public void DecryptWalletTest_ReturnsWalletWithCorrectPassword()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var wallet = solanaCryptoService.CreateWallet();
        var pass = "fh43b4fy345rdtwd";
        var json = solanaCryptoService.EncryptWallet(wallet, pass);
        
        // Act
        var retrievedWallet = solanaCryptoService.DecryptWallet(json, pass);
        
        // Assert
        Assert.NotNull(retrievedWallet);
        Assert.Equal(wallet.Account, retrievedWallet.Account);
        Assert.Equal(wallet.Mnemonic.ToString(), retrievedWallet.Mnemonic.ToString());
    }
    
    [Fact]
    public void DecryptWalletTest_ReturnsExceptionWithIncorrectPassword()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var wallet = solanaCryptoService.CreateWallet();
        var password = "fh43b4fy345rdtwd";
        var json = solanaCryptoService.EncryptWallet(wallet, password);
        
        // Act & Assert
        Assert.Throws<DecryptionException>(() => solanaCryptoService.DecryptWallet(json, "IncorrectPassword"));
    }
    
    [Fact]
    public void GetWalletTest_ReturnsProperWallet()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var wallet1 = solanaCryptoService.CreateWallet();
        var wallet2 = new Wallet(WordCount.Twelve, WordList.English, "passphrase", SeedMode.Bip39);

        // Act
        var retrievedWallet1 = solanaCryptoService.GetWallet(wallet1.Mnemonic.ToString());
        var retrievedWallet2 = solanaCryptoService.GetWallet(wallet2.Mnemonic.ToString(),"passphrase");
        
        // Assert
        Assert.NotNull(retrievedWallet1); 
        Assert.Equal(wallet1.Account, retrievedWallet1.Account);
        Assert.Equal(wallet1.Mnemonic.ToString(), retrievedWallet1.Mnemonic.ToString());
        
        Assert.NotNull(retrievedWallet2); 
        Assert.Equal(wallet2.Account, retrievedWallet2.Account);
        Assert.Equal(wallet2.Mnemonic.ToString(), retrievedWallet2.Mnemonic.ToString());
    }
    
    [Fact]
    public void GetWalletTest_ReturnsWrongWalletWithWrongPassphrase()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var mnemonic =
            "fantasy earn matrix need only auction dance flight silver course naive pride " +
            "awake auction visual dress lend smooth vault weird polar dash runway change";
        
        var wallet = new Wallet(mnemonic, WordList.English, "passphrase", SeedMode.Bip39);

        // Act
        var retrievedWallet = solanaCryptoService.GetWallet(mnemonic,"wrong passphrase");
        
        // Assert
        Assert.NotNull(retrievedWallet); 
        Assert.NotEqual(wallet.Account, retrievedWallet.Account);
    }

    [Fact]
    public void SendTokenTest_ReturnsTransactionResult_Success()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var mnemonics1 =
            "fantasy earn matrix need only auction dance flight silver course naive pride " +
            "awake auction visual dress lend smooth vault weird polar dash runway change";
        var mnemonics2 =
            "zoo virtual sun kidney output brush sail whip inflict legal develop renew paddle " +
            "margin bicycle setup example winner session dwarf view priority multiply warfare";
        var ownerWallet = new Wallet(mnemonics1);
        var receivingWallet = new Wallet(mnemonics2);
        var newWallet = solanaCryptoService.CreateWallet();
        string tokenAddress = "DN8CViMVdgdFvCC9rogdLY7EjV6PCJ2RXUJg3YiFBRjA";
        
        // Act
        //Owner account sends token
        var firstTransaction = solanaCryptoService.SendTokens(200, ownerWallet, ownerWallet, receivingWallet.Account.PublicKey, tokenAddress);
        //Receiving account sends tokens back to owner
        var secondTransaction = solanaCryptoService.SendTokens(100, receivingWallet, ownerWallet, ownerWallet.Account.PublicKey, tokenAddress);
        //Receiving account sends tokens back to owner
        var thirdTransaction = solanaCryptoService.SendTokens(100, receivingWallet, ownerWallet, newWallet.Account.PublicKey, tokenAddress);
        
        // Assert
        Assert.NotNull(firstTransaction); 
        Assert.True(firstTransaction.WasSuccessful());
        Assert.NotNull(firstTransaction.result);
        
        Assert.NotNull(secondTransaction); 
        Assert.True(secondTransaction.WasSuccessful());
        Assert.NotNull(secondTransaction.result);
        
        Assert.NotNull(thirdTransaction); 
        Assert.True(thirdTransaction.WasSuccessful());
        Assert.NotNull(thirdTransaction.result);
    }
    
    [Fact]
    public void SendTokenTest_ReturnsTransactionResult_Fail()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var mnemonics1 =
            "fantasy earn matrix need only auction dance flight silver course naive pride " +
            "awake auction visual dress lend smooth vault weird polar dash runway change";
        var mnemonics2 =
            "zoo virtual sun kidney output brush sail whip inflict legal develop renew paddle " +
            "margin bicycle setup example winner session dwarf view priority multiply warfare";
        var ownerWallet = new Wallet(mnemonics1);
        var walletWithTokens = new Wallet(mnemonics2);
        var newWallet = new Wallet(WordCount.TwentyFour,WordList.English);
        string tokenAddress = "DN8CViMVdgdFvCC9rogdLY7EjV6PCJ2RXUJg3YiFBRjA";
        
        // Act
        //Wallet account sends tokens but fee payer is not owner account (which holds SOls)
        var firstTransaction = solanaCryptoService.SendTokens(100, walletWithTokens, walletWithTokens, newWallet.Account.PublicKey, tokenAddress);
        //Wallet account send amount of tokens bigger than it holds in its account
        var secondTransaction = solanaCryptoService.SendTokens(100_000_000_000_000, walletWithTokens, ownerWallet, newWallet.Account.PublicKey, tokenAddress);

        // Act & Assert
        Assert.Throws<AggregateException>(() => solanaCryptoService.SendTokens(100, newWallet, ownerWallet, ownerWallet.Account.PublicKey, tokenAddress));
        
        // Assert
        Assert.NotNull(firstTransaction); 
        Assert.False(firstTransaction.WasSuccessful());
        Assert.NotNull(firstTransaction.error);
        
        Assert.NotNull(secondTransaction); 
        Assert.False(secondTransaction.WasSuccessful());
        Assert.NotNull(secondTransaction.error);
    }

    [Fact]
    public void GetTokenBalance_ReturnsCorrectBalance()
    {
        // Arrange
        var solanaCryptoService = new SolanaCryptoService();
        var mnemonics =
            "pact cake reveal gaze eagle suggest angry mandate draw path seven parrot " +
            "above napkin green sample coast athlete dutch appear orphan marble tape weasel";
        var wallet1 = solanaCryptoService.CreateWallet();
        var wallet2 = new Wallet(mnemonics);
        string tokenAddress = "DN8CViMVdgdFvCC9rogdLY7EjV6PCJ2RXUJg3YiFBRjA";
        
        // Act
        var balance1 = solanaCryptoService.GetTokenBalance(wallet1.Account.PublicKey, tokenAddress );
        var balance2 = solanaCryptoService.GetTokenBalance(wallet2.Account.PublicKey, tokenAddress );
        
        // Assert
        Assert.NotNull(balance1); 
        Assert.Equal(0,balance1);
        
        Assert.NotNull(balance2); 
        Assert.Equal(10000,balance2);


    }

}

