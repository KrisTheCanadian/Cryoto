using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using API.Crypto.Services.Interfaces;
using API.Crypto.Solana.SolanaObjects;
using API.Models.Notifications;
using API.Models.Transactions;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services;
using API.Services.Interfaces;
using Azure.Storage.Queues;
using FakeItEasy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Solnet.Rpc;
using Solnet.Rpc.Core.Http;
using Solnet.Rpc.Messages;
using Solnet.Rpc.Types;
using Solnet.Rpc.Utilities;
using Solnet.Wallet;
using Solnet.Wallet.Bip39;
using Xunit;

namespace API.Tests.ServicesTests;

public class CryptoServiceTests
{
    private readonly ICryptoService _cryptoService;
    private readonly CryptoService _cryptoServiceObject;
    private readonly ISolanaService _solanaService;
    private readonly ITransactionService _transactionService;
    private readonly IWalletRepository _walletRepository;
    private readonly IUserProfileService _userProfileService;
    private readonly INotificationService _notificationService;
    private readonly QueueClient _queueClient;
    private readonly IConfiguration _configuration;

    public CryptoServiceTests()
    {
        _walletRepository = A.Fake<IWalletRepository>();
        _solanaService = A.Fake<ISolanaService>();
        _configuration = A.Fake<IConfiguration>();
        _queueClient = A.Fake<QueueClient>();
        _userProfileService = A.Fake<IUserProfileService>();
        _transactionService = A.Fake<ITransactionService>();
        _notificationService = A.Fake<INotificationService>();
        var logger = A.Fake<ILogger<CryptoService>>();
        _cryptoService = A.Fake<ICryptoService>();
        _cryptoServiceObject = new CryptoService(_walletRepository, _solanaService, _configuration, _queueClient,
            _userProfileService, _transactionService, _notificationService, logger);
    }

    [Fact]
    public async Task BoostRecognition_WithValidSenderAndRecipients_ReturnsTrue()
    {
        // Arrange
        var senderId = "senderId";
        var recipientIds = new List<string> { "recipient1", "recipient2", "recipient3" };
        var walletType = "toAward";
        var boostAmount = 10f;
        var senderWallet = new WalletModel("publicKey", "wallet", senderId, walletType,
            1 + boostAmount * recipientIds.Count);
        var wallet = new Wallet(WordCount.TwentyFour, WordList.English);

        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(senderId, walletType)).Returns(senderWallet);
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _cryptoService.QueueTokenUpdateAsync(A<List<List<string>>>._)).DoesNothing();
        A.CallTo(() => _solanaService.SendTokens(A<double>._, A<Wallet>._, A<Wallet>._, A<PublicKey>._, A<string>._))
            .Returns(A.Fake<RpcTransactionResult>());
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(wallet);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(wallet);

        // Act
        var result = await _cryptoServiceObject.BoostRecognition(senderId, recipientIds);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task BoostRecognition_WithValidSenderAndRecipients_ReturnsFalse()
    {
        // Arrange
        var senderId = "senderId";
        var recipientIds = new List<string> { "recipient1", "recipient2", "recipient3" };
        var walletType = "toAward";
        var boostAmount = 10f;
        var senderWallet = new WalletModel("publicKey", "wallet", senderId, walletType,
            -1 + boostAmount * recipientIds.Count);
        var wallet = new Wallet(WordCount.TwentyFour, WordList.English);

        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(senderId, walletType)).Returns(senderWallet);
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _cryptoService.QueueTokenUpdateAsync(A<List<List<string>>>._)).DoesNothing();
        A.CallTo(() => _solanaService.SendTokens(A<double>._, A<Wallet>._, A<Wallet>._, A<PublicKey>._, A<string>._))
            .Returns(A.Fake<RpcTransactionResult>());
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(wallet);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(wallet);

        // Act
        var result = await _cryptoServiceObject.BoostRecognition(senderId, recipientIds);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task BoostRecognition_WithValidSenderAndRecipients_ReturnsFalse2()
    {
        // Arrange
        var senderId = "senderId";
        var recipientIds = new List<string> { "recipient1", "recipient2", "recipient3" };
        var walletType = "toAward";
        var boostAmount = 10f;
        var senderWallet = new WalletModel("publicKey", "wallet", senderId, walletType,
            1 + boostAmount * recipientIds.Count);
        var wallet = new Wallet(WordCount.TwentyFour, WordList.English);
        var rpcTransactionResult = new RpcTransactionResult();
        rpcTransactionResult.error = new RpcTransactionResult.Error();

        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(senderId, walletType)).Returns(senderWallet);
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _cryptoService.QueueTokenUpdateAsync(A<List<List<string>>>._)).DoesNothing();
        A.CallTo(() => _solanaService.SendTokens(A<double>._, A<Wallet>._, A<Wallet>._, A<PublicKey>._, A<string>._))
            .Returns(rpcTransactionResult);
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(wallet);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(wallet);

        // Act
        var result = await _cryptoServiceObject.BoostRecognition(senderId, recipientIds);

        // Assert
        Assert.False(result);
    }
    
    [Fact]
    public async Task GetWalletsBalanceAsync_ShouldReturnCorrectWalletBalances()
    {
        // Arrange
        var oid = "testOid";
        var toAwardBalance = 0;
        var toSpendBalance = 0;

        // Mock the GetOrAddUserProfileService method in the IUserProfileService
        A.CallTo(() => _userProfileService.GetOrAddUserProfileService(oid, null)).Returns((UserProfileModel)null!);

        // Mock the GetTokenBalanceAsync method in the CryptoService
        A.CallTo(() => _cryptoService.GetTokenBalanceAsync(oid, "toAward")).Returns(toAwardBalance);
        A.CallTo(() => _cryptoService.GetTokenBalanceAsync(oid, "toSpend")).Returns(toSpendBalance);

        // Act
        var result = await _cryptoServiceObject.GetWalletsBalanceAsync(oid);

        // Assert
        Assert.Equal(toAwardBalance, result.ToAwardBalance);
        Assert.Equal(toSpendBalance, result.ToSpendBalance);
    }
    
    [Fact]
    public void GetTokenBalanceAsync_WithValidOidAndWalletType_ReturnsExpectedBalance()
    {
        // Arrange
        var oid = "123";
        var walletType = "toAward";

        // Act
        var balance = _cryptoServiceObject.GetTokenBalanceAsync(oid, walletType);

        // Assert
        Assert.Equal(0, balance);
    }
    
    [Fact]
    public void GetOrCreateUserWallet_ShouldReturnExistingWallet_WhenWalletExists()
    {
        // Arrange
        var oid = "1234";
        var walletType = "toAward";

        // Act
        var result = _cryptoServiceObject.GetTokenBalanceAsync(oid, walletType);

        // Assert
        Assert.Equal(0, result);
    }
    
    [Fact]
    public async Task SelfTransferTokens_ShouldReturnRpcTransactionResult_WhenCalled()
    {
        // Arrange
        var amount = 10.0;
        var userOId = "123";
        var expectedTransactionResult = new RpcTransactionResult { error = null };
        A.CallTo(() => _solanaService.SendTokens(amount, A<Wallet>._, A<Wallet>._, A<PublicKey>._, A<string>._)).Returns(expectedTransactionResult);
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(userOId, "toSpend")).Returns(new WalletModel("publicKey", "wallet", userOId, "toSpend", 100));
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));

        // Act
        var actualTransactionResult = await _cryptoServiceObject.SelfTransferTokens(amount, userOId);

        // Assert
        Assert.Equal(expectedTransactionResult, actualTransactionResult);
    }
    
    [Fact]
    public async Task CreatePurchase_ShouldReturnRpcTransactionResult_WhenCalled()
    {
        // Arrange
        var amount = 10.0;
        var userOId = "123";
        var expectedTransactionResult = new RpcTransactionResult { error = null };

        A.CallTo(() => _solanaService.SendTokens(amount, A<Wallet>._, A<Wallet>._, A<PublicKey>._, A<string>._)).Returns(expectedTransactionResult);
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(userOId, "toSpend")).Returns(new WalletModel("publicKey", "wallet", userOId, "toSpend", 100));
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));

        // Act
        var actualTransactionResult = await _cryptoServiceObject.CreatePurchase(amount, userOId);

        // Assert
        Assert.Equal(expectedTransactionResult, actualTransactionResult);
    }
    
    [Fact]
    public async Task AddTokensAsync_ShouldReturnRpcTransactionResult_WhenCalled()
    {
        // Arrange
        var amount = 10.0;
        var userOId = "123";
        var walletType = "toSpend";
        var expectedTransactionResult = new RpcTransactionResult { error = null };
        A.CallTo(() => _solanaService.SendTokens(amount, A<Wallet>._, A<Wallet>._, A<PublicKey>._, A<string>._)).Returns(expectedTransactionResult);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(userOId, walletType)).Returns(new WalletModel("publicKey", "wallet", userOId, walletType, 100));

        // Act
        var actualTransactionResult = await _cryptoServiceObject.AddTokensAsync(amount, userOId, walletType);

        // Assert
        Assert.Equal(expectedTransactionResult, actualTransactionResult);
    }

    [Fact]
    public async Task GetSolanaTokenBalanceAsync_ShouldReturnBalance_WhenCalled()
    {
        // Arrange
        var oid = "123";
        var walletType = "toSpend";
        var expectedBalance = 10.0;
        A.CallTo(() => _solanaService.GetTokenBalance(A<PublicKey>._, A<string>._)).Returns(expectedBalance);
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(oid, walletType)).Returns(new WalletModel("publicKey", "wallet", oid, walletType, 100));
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));

        // Act
        var actualBalance = await _cryptoServiceObject.GetSolanaTokenBalanceAsync(oid, walletType);

        // Assert
        Assert.Equal(expectedBalance, actualBalance);
    }
    
    [Fact]
    public async Task UpdateSolanaTokenBalance_ShouldReturnTrue_WhenSuccessfullyUpdated()
    {
        // Arrange
        var oid = "123";
        var walletType = "toSpend";
        var tokenBalance = 50.0;
        var expectedUpdated = true;
        var walletModel = new WalletModel("publicKey", "encrypted", oid, walletType, tokenBalance);
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsTrackingAsync(oid, walletType)).Returns(walletModel);
        A.CallTo(() => _walletRepository.UpdateWalletModelAsync(walletModel)).Returns(Task.FromResult(true));
        A.CallTo(() => _walletRepository.SaveChangesAsync()).Returns(1);

        // Act
        var actualUpdated = await _cryptoServiceObject.UpdateSolanaTokenBalance(tokenBalance, oid, walletType);

        // Assert
        Assert.Equal(expectedUpdated, actualUpdated);
        Assert.Equal(tokenBalance, walletModel.TokenBalance);
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsTrackingAsync(oid, walletType)).MustHaveHappenedOnceExactly();
        A.CallTo(() => _walletRepository.UpdateWalletModelAsync(walletModel)).MustHaveHappenedOnceExactly();
        A.CallTo(() => _walletRepository.SaveChangesAsync()).MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async Task SendMonthlyTokenBasedOnRoleAdmin_ShouldReturnTrue_WhenRpcTransactionResultIsNull()
    {
        // Arrange
        var oid = "123";
        var expectedAmount = 50.0;
        var expectedWalletType = "toAward";
        var walletModel = new WalletModel("publicKey", "encrypted", oid, expectedWalletType, expectedAmount);
        var expectedUserProfileModel = new UserProfileModel(oid, "test", "test@test.com", "EN", new[] { "Admin", "AddNewRole" });
        var expectedRpcTransactionResult = new RpcTransactionResult { error = null };
        
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(expectedUserProfileModel);
        A.CallTo(() => _cryptoService.AddTokensAsync(expectedAmount, oid, expectedWalletType)).Returns(expectedRpcTransactionResult);
        A.CallTo(() => _cryptoService.UpdateTokenBalance(expectedAmount, oid, expectedWalletType)).Returns(true);
        A.CallTo(() => _notificationService.SendNotificationAsync(A<Notification>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(expectedUserProfileModel);
        
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsTrackingAsync(oid, expectedWalletType)).Returns(walletModel);
        A.CallTo(() => _walletRepository.UpdateWalletModelAsync(walletModel)).Returns(Task.FromResult(true));
        A.CallTo(() => _walletRepository.SaveChangesAsync()).Returns(1);
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(oid, "toSpend")).Returns(new WalletModel("publicKey", "wallet", oid, "toSpend", 100));
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));

        // Act
        var result = await _cryptoServiceObject.SendMonthlyTokenBasedOnRole(oid);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public async Task SendMonthlyTokenBasedOnRoleAddNewRole_ShouldReturnTrue_WhenRpcTransactionResultIsNull()
    {
        // Arrange
        var oid = "123";
        var expectedAmount = 50.0;
        var expectedWalletType = "toAward";
        var walletModel = new WalletModel("publicKey", "encrypted", oid, expectedWalletType, expectedAmount);
        var expectedUserProfileModel = new UserProfileModel(oid, "test", "test@test.com", "EN", new[] { "AddNewRole" });
        var expectedRpcTransactionResult = new RpcTransactionResult { error = null };
        
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(expectedUserProfileModel);
        A.CallTo(() => _cryptoService.AddTokensAsync(expectedAmount, oid, expectedWalletType)).Returns(expectedRpcTransactionResult);
        A.CallTo(() => _cryptoService.UpdateTokenBalance(expectedAmount, oid, expectedWalletType)).Returns(true);
        A.CallTo(() => _notificationService.SendNotificationAsync(A<Notification>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(expectedUserProfileModel);
        
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsTrackingAsync(oid, expectedWalletType)).Returns(walletModel);
        A.CallTo(() => _walletRepository.UpdateWalletModelAsync(walletModel)).Returns(Task.FromResult(true));
        A.CallTo(() => _walletRepository.SaveChangesAsync()).Returns(1);
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(oid, "toSpend")).Returns(new WalletModel("publicKey", "wallet", oid, "toSpend", 100));
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));

        // Act
        var result = await _cryptoServiceObject.SendMonthlyTokenBasedOnRole(oid);

        // Assert
        Assert.True(result);
    }
    
        [Fact]
    public async Task SendMonthlyTokenBasedOnRoleUser_ShouldReturnTrue_WhenRpcTransactionResultErrorIsNull()
    {
        // Arrange
        var oid = "123";
        var expectedAmount = 50.0;
        var expectedWalletType = "toAward";
        var walletModel = new WalletModel("publicKey", "encrypted", oid, expectedWalletType, expectedAmount);
        var expectedUserProfileModel = new UserProfileModel(oid, "test", "test@test.com", "EN", new[] { "User" });
        var expectedRpcTransactionResult = new RpcTransactionResult { error = null };
        
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(expectedUserProfileModel);
        A.CallTo(() => _cryptoService.AddTokensAsync(expectedAmount, oid, expectedWalletType)).Returns(expectedRpcTransactionResult);
        A.CallTo(() => _cryptoService.UpdateTokenBalance(expectedAmount, oid, expectedWalletType)).Returns(true);
        A.CallTo(() => _notificationService.SendNotificationAsync(A<Notification>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(expectedUserProfileModel);
        
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsTrackingAsync(oid, expectedWalletType)).Returns(walletModel);
        A.CallTo(() => _walletRepository.UpdateWalletModelAsync(walletModel)).Returns(Task.FromResult(true));
        A.CallTo(() => _walletRepository.SaveChangesAsync()).Returns(1);
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(oid, "toSpend")).Returns(new WalletModel("publicKey", "wallet", oid, "toSpend", 100));
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));

        // Act
        var result = await _cryptoServiceObject.SendMonthlyTokenBasedOnRole(oid);

        // Assert
        Assert.True(result);
    }
    
    
    [Fact]
    public async Task GetAnniversaryBonusAmountOfRoleByOIdAsync_ForUser_ShouldReturnCorrectAmount_WhenCalled()
    {
        // Arrange
        var oid = "123";
        var expectedAmount = 30.0;
        var userProfileModel = new UserProfileModel(oid, "test", "test@test.com", "EN", new[] { "User" });
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(userProfileModel);

        // Act
        var actualAmount = await _cryptoServiceObject.GetAnniversaryBonusAmountOfRoleByOIdAsync(oid);

        // Assert
        Assert.Equal(expectedAmount, actualAmount);
    }
    
    [Fact]
    public async Task GetAnniversaryBonusAmountOfRoleByOIdAsync_ForAdmin_ShouldReturnCorrectAmount_WhenCalled()
    {
        // Arrange
        var oid = "123";
        var expectedAmount = 150;
        var userProfileModel = new UserProfileModel(oid, "test", "test@test.com", "EN", new[] { "Admin" });
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(userProfileModel);

        // Act
        var actualAmount = await _cryptoServiceObject.GetAnniversaryBonusAmountOfRoleByOIdAsync(oid);

        // Assert
        Assert.Equal(expectedAmount, actualAmount);
    }
    
    [Fact]
    public async Task GetAnniversaryBonusAmountOfRoleByOIdAsync_ForAddNewRole_ShouldReturnCorrectAmount_WhenCalled()
    {
        // Arrange
        var oid = "123";
        var expectedAmount = 90;
        var userProfileModel = new UserProfileModel(oid, "test", "test@test.com", "EN", new[] { "AddNewRole" });
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(userProfileModel);

        // Act
        var actualAmount = await _cryptoServiceObject.GetAnniversaryBonusAmountOfRoleByOIdAsync(oid);

        // Assert
        Assert.Equal(expectedAmount, actualAmount);
    }
    
    [Fact]
    public async Task SendAnniversaryTokenByOId_ShouldSendTokensAndAddTransaction_WhenWalletExists()
    {
        // Arrange
        var oid = "123";
        var walletType = "toSpend";
        var amount = 30.0;
        var expectedTransactionResult = new RpcTransactionResult { error = null };
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).Returns(new UserProfileModel(oid, "test", "test@test.com", "EN", new[] { "User" }));
        A.CallTo(() => _solanaService.SendTokens(amount, A<Wallet>._, A<Wallet>._, A<PublicKey>._, A<string>._)).Returns(expectedTransactionResult);
        A.CallTo(() => _solanaService.DecryptWallet(A<string>._, A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _solanaService.GetWallet(A<string>._, A<string>._)).Returns(new Wallet(WordCount.TwentyFour, WordList.English));
        A.CallTo(() => _walletRepository.GetWalletModelByOIdAsync(oid, walletType)).Returns(new WalletModel("publicKey", "wallet", oid, walletType, 100));

        // Act
        var result = await _cryptoServiceObject.SendAnniversaryTokenByOId(oid);

        // Assert
        Assert.True(result);
        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>.That.Matches(t => t.TokenAmount == amount && t.Type == "AnniversaryGift"))).MustHaveHappenedOnceExactly();
        A.CallTo(() => _userProfileService.GetUserByIdAsync(oid)).MustHaveHappenedOnceOrMore();
        A.CallTo(() => _notificationService.SendNotificationAsync(A<Notification>.That.Matches(n => n.Type == "AnniversaryGift" && n.Amount == amount))).MustHaveHappenedOnceExactly();
        A.CallTo(() => _notificationService.SendEmailAsync("test@test.com", "Happy Work Anniversary!", A<string>._, true)).MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async Task QueueAnniversaryBonus_ShouldSendMessageToQueueClient_WhenCalled()
    {
        // Arrange
        var message = new List<List<string>> { new() { "AnniversaryBonusQueue" }, new() { "user123" } };
        var serializedMessage = JsonSerializer.Serialize(message);

        // Act
        await _cryptoServiceObject.QueueAnniversaryBonusAsync(message);

        // Assert
        A.CallTo(() => _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromHours(24), TimeSpan.FromSeconds(-1), A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async Task QueueTokenUpdate_ShouldSendMessageToQueueClient_WhenCalled()
    {
        // Arrange
        var message = new List<List<string>> { new() { "tokenUpdateQueue" }, new() { "user123", "toSpend" } };
        var serializedMessage = JsonSerializer.Serialize(message);

        // Act
        await _cryptoServiceObject.QueueTokenUpdateAsync(message);

        // Assert
        A.CallTo(() => _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(-1), A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async Task QueueSolUpdateAsync_ShouldSendMessageToQueueClient_WhenCalled()
    {
        // Arrange
        var message = new List<List<string>> { new() { "SolUpdateQueue" }, new() { "user123" } };
        var serializedMessage = JsonSerializer.Serialize(message);

        // Act
        await _cryptoServiceObject.QueueSolUpdateAsync(message);

        // Assert
        A.CallTo(() => _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromHours(48), TimeSpan.FromSeconds(-1), A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }
    
    [Fact]
    public async Task QueueMonthlyTokensGiftAsync_ShouldSendMessageToQueueClient_WhenCalled()
    {
        // Arrange
        var message = new List<List<string>> { new() { "MonthlyTokensGiftQueue" }, new() { "user123", "1" } };
        var serializedMessage = JsonSerializer.Serialize(message);

        // Act
        await _cryptoServiceObject.QueueMonthlyTokensGiftAsync(message);

        // Assert
        A.CallTo(() => _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromDays(7), TimeSpan.FromSeconds(-1), A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }
}