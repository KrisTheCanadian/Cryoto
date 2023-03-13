using System.Collections.Generic;
using System.Threading.Tasks;
using API.Crypto.Services.Interfaces;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Transactions;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services;
using API.Services.Interfaces;
using Azure.Storage.Queues;
using Microsoft.Extensions.Configuration;
using FakeItEasy;
using Solnet.Wallet;
using Solnet.Wallet.Bip39;
using Xunit;

namespace API.Tests.ServicesTests;

public class CryptoServiceTests
{
    private readonly IWalletRepository _walletRepository;
    private readonly ISolanaService _solanaService;
    private readonly IConfiguration _configuration;
    private readonly QueueClient _queueClient;
    private readonly IUserProfileService _userProfileService;
    private readonly ITransactionService _transactionService;
    private readonly INotificationService _notificationService;
    private readonly ICryptoService _cryptoService;
    private readonly CryptoService _cryptoServiceObject;

    public CryptoServiceTests()
    {
        _walletRepository = A.Fake<IWalletRepository>();
        _solanaService = A.Fake<ISolanaService>();
        _configuration = A.Fake<IConfiguration>();
        _queueClient = A.Fake<QueueClient>();
        _userProfileService = A.Fake<IUserProfileService>();
        _transactionService = A.Fake<ITransactionService>();
        _notificationService = A.Fake<INotificationService>();
        _cryptoService = A.Fake<ICryptoService>();
        _cryptoServiceObject = new CryptoService(_walletRepository, _solanaService, _configuration, _queueClient, _userProfileService, _transactionService, _notificationService);
    }
    
    [Fact]
    public async void BoostRecognition_WithValidSenderAndRecipients_ReturnsTrue()
    {
        // Arrange
        var senderId = "senderId";
        var recipientIds = new List<string> { "recipient1", "recipient2", "recipient3" };
        var walletType = "toAward";
        var boostAmount = 10f;
        var senderWallet = new WalletModel ("publicKey", "wallet", senderId, walletType, 1 + boostAmount * recipientIds.Count );
        var wallet = new Wallet(WordCount.TwentyFour, WordList.English);

        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(senderId, walletType)).Returns(senderWallet);
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _cryptoService.QueueTokenUpdate(A<List<List<string>>>._)).DoesNothing();
        A.CallTo(() => _solanaService.SendTokens(A<double>._, A<Wallet>._,A<Wallet>._, A<PublicKey>._, A<string>._)).Returns(A.Fake<RpcTransactionResult>());
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(wallet);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(wallet);
        
        // Act
        var result = await _cryptoServiceObject.BoostRecognition(senderId, recipientIds);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async void BoostRecognition_WithValidSenderAndRecipients_ReturnsFalse()
    {
        // Arrange
        var senderId = "senderId";
        var recipientIds = new List<string> { "recipient1", "recipient2", "recipient3" };
        var walletType = "toAward";
        var boostAmount = 10f;
        var senderWallet = new WalletModel ("publicKey", "wallet", senderId, walletType, - 1 + boostAmount * recipientIds.Count );
        var wallet = new Wallet(WordCount.TwentyFour, WordList.English);

        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(senderId, walletType)).Returns(senderWallet);
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _cryptoService.QueueTokenUpdate(A<List<List<string>>>._)).DoesNothing();
        A.CallTo(() => _solanaService.SendTokens(A<double>._, A<Wallet>._,A<Wallet>._, A<PublicKey>._, A<string>._)).Returns(A.Fake<RpcTransactionResult>());
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(wallet);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(wallet);

        // Act
        var result = await _cryptoServiceObject.BoostRecognition(senderId, recipientIds);

        // Assert
        Assert.False(result);
    }
    
    [Fact]
    public async void BoostRecognition_WithValidSenderAndRecipients_ReturnsFalse2()
    {
        // Arrange
        var senderId = "senderId";
        var recipientIds = new List<string> { "recipient1", "recipient2", "recipient3" };
        var walletType = "toAward";
        var boostAmount = 10f;
        var senderWallet = new WalletModel ("publicKey", "wallet", senderId, walletType, 1 + boostAmount * recipientIds.Count );
        var wallet = new Wallet(WordCount.TwentyFour, WordList.English);
        var rpcTransactionResult = new RpcTransactionResult();
        rpcTransactionResult.error = new RpcTransactionResult.Error();

        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(senderId, walletType)).Returns(senderWallet);
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _cryptoService.QueueTokenUpdate(A<List<List<string>>>._)).DoesNothing();
        A.CallTo(() => _solanaService.SendTokens(A<double>._, A<Wallet>._,A<Wallet>._, A<PublicKey>._, A<string>._)).Returns(rpcTransactionResult);
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(wallet);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(wallet);

        // Act
        var result = await _cryptoServiceObject.BoostRecognition(senderId, recipientIds);

        // Assert
        Assert.False(result);
    }
    
}