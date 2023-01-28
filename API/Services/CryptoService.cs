using System.Security.Claims;
using API.Crypto.Services.Interfaces;
using API.Crypto.Solana.SolanaObjects;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using Azure.Storage.Queues;
using Solnet.Wallet;
using System.Text.Json;
using Solnet.Rpc;
using API.Models.Notifications;
using API.Models.Transactions;
using API.Models.Users;


namespace API.Services;

public class CryptoService : ICryptoService
{
    private readonly IWalletRepository _context;
    private readonly ISolanaService _solanaService;
    private readonly IUserProfileService _userProfileService;
    private readonly IConfiguration _configuration;
    private readonly QueueClient _queueClient;
    private readonly ITransactionService _transactionService;
    private readonly INotificationService _notificationService;


    public CryptoService(IWalletRepository context, ISolanaService solanaService, IConfiguration configuration,
        QueueClient queueClient, IUserProfileService userProfileService, ITransactionService transactionService,
        INotificationService notificationService)
    {
        _context = context;
        _solanaService = solanaService;
        _configuration = configuration;
        _queueClient = queueClient;
        _userProfileService = userProfileService;
        _transactionService = transactionService;
        _notificationService = notificationService;
    }

    private Wallet GetOwnerWallet()
    {
        return _solanaService.GetWallet(_configuration["OwnerWallet-Mnemonics"],
            _configuration["OwnerWallet-Passphrase"]);
    }

    private async Task<Wallet> GetWalletByOIdAsync(string oid, string walletType)
    {
        var walletModel = await _context.GetWalletModelByOIdAsync(oid, walletType);
        return _solanaService.DecryptWallet(walletModel!.Wallet, oid);
    }

    private async Task<WalletModel?> GetOrCreateUserWallet(string oid, string walletType)
    {
        var walletModel = await _context.GetWalletModelByOIdAsync(oid, walletType);
        if (walletModel != null)
            return walletModel;

        // Creat new wallet if it does not exist.
        var wallet = _solanaService.CreateWallet();
        var walletEncrypted = _solanaService.EncryptWallet(wallet, oid);
        var walletPublicKey = wallet.Account.PublicKey;
        walletModel = new WalletModel(walletPublicKey, walletEncrypted, oid, walletType, 100);

        if (await _context.AddWalletModelAsync(walletModel) <= 0) return null;

        var rpcTransactionResult = await AddTokensAsync(100, oid, walletType);
        if (rpcTransactionResult.error == null)
        {
            await _transactionService.AddTransactionAsync(new TransactionModel(oid, walletType, "master",
                "master", 100, "WelcomeTransfer", DateTimeOffset.UtcNow));
        }

        var userProfileModel = await _userProfileService.GetUserByIdAsync(oid);


        await SendNotification(oid, userProfileModel);

        QueueTokenUpdate(new List<List<string>>
            { new() { "tokenUpdateQueue" }, new() { oid, oid } });

        // Register the user to receive the monthly tokens gift
        QueueMonthlyTokensGift(new List<List<string>>
            { new() { "monthlyTokenQueue" }, new() { oid, "1" } });

        return walletModel;
    }

    public async Task<UserWalletsModel> GetWalletsBalanceAsync(string oid, ClaimsIdentity? user = null)
    {
        // Create userProfile if it has not been created before.
        await _userProfileService.GetOrAddUserProfileService(oid, user);
        double toAwardBalance = 0;
        double toSpendBalance = 0;
        using (var mutex = new Mutex(false, "WalletCreateAndNotificationMutex"))
        {
            try
            {
                mutex.WaitOne();
                toSpendBalance = GetTokenBalanceAsync(oid, "toSpend");
                mutex.ReleaseMutex();
                mutex.WaitOne();
                toAwardBalance = GetTokenBalanceAsync(oid, "toAward");
                mutex.ReleaseMutex();
            }
            catch (Exception)
            {
                // making sure mutex is released in case of exception
                mutex.ReleaseMutex();
            }
        }

        var userWalletsModel = new UserWalletsModel(toAwardBalance, toSpendBalance);

        return userWalletsModel;
    }

    public double GetTokenBalanceAsync(string oid, string walletType)
    {
        var walletModel = GetOrCreateUserWallet(oid, walletType);
        return walletModel.Result!.TokenBalance;
    }

    public async Task<RpcTransactionResult?> SendTokens(double amount, string senderOId, string receiverOId)
    {
        var senderWallet = await GetWalletByOIdAsync(senderOId, "toAward");
        var receiverWallet = await GetWalletByOIdAsync(receiverOId, "toSpend");
        var ownerWallet = GetOwnerWallet();
        var receiverPublicKey = receiverWallet.Account.PublicKey;
        var rpcTransactionResult = _solanaService.SendTokens(amount, senderWallet, ownerWallet, receiverPublicKey,
            _configuration["tokenAddress"]);
        if (rpcTransactionResult.error != null)
        {
            await UpdateTokenBalance((-amount), senderOId, "toAward");
            await UpdateTokenBalance(amount, receiverOId, "toSpend");
        }

        return rpcTransactionResult;
    }

    public async Task<RpcTransactionResult> SelfTransferTokens(double amount, string userOId)
    {
        var senderWallet = await GetWalletByOIdAsync(userOId, "toSpend");
        var receiverWallet = await GetWalletByOIdAsync(userOId, "toAward");
        var ownerWallet = GetOwnerWallet();
        var receiverPublicKey = receiverWallet.Account.PublicKey;
        var rpcTransactionResult = _solanaService.SendTokens(amount, senderWallet, ownerWallet, receiverPublicKey,
            _configuration["tokenAddress"]);
        return rpcTransactionResult;
    }

    public async Task<RpcTransactionResult> CreatePurchase(double amount, string userOId)
    {
        var userWallet = await GetWalletByOIdAsync(userOId, "toSpend");
        var ownerWallet = GetOwnerWallet();
        var receiverPublicKey = ownerWallet.Account.PublicKey;
        return _solanaService.SendTokens(amount, userWallet, ownerWallet, receiverPublicKey,
            _configuration["tokenAddress"]);
    }

    public async Task<RpcTransactionResult> AddTokensAsync(double amount, string userOId, string walletType)
    {
        var userWallet = await GetWalletByOIdAsync(userOId, walletType);
        var ownerWallet = GetOwnerWallet();
        var receiverPublicKey = userWallet.Account.PublicKey;
        return _solanaService.SendTokens(amount, ownerWallet, ownerWallet, receiverPublicKey,
            _configuration["tokenAddress"]);
    }

    public async Task<double> GetSolanaTokenBalanceAsync(string oid, string walletType)
    {
        var wallet = await GetWalletByOIdAsync(oid, walletType);
        var publicKey = wallet.Account.PublicKey;

        return _solanaService.GetTokenBalance(publicKey, _configuration["tokenAddress"]);
    }

    public async Task<bool> UpdateTokenBalance(double amount, string oid, string walletType)
    {
        var walletModel = await _context.GetWalletModelByOIdAsTrackingAsync(oid, walletType);
        walletModel.TokenBalance += amount;
        await _context.UpdateWalletModelAsync(walletModel);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateSolanaTokenBalance(double tokenBalance, string oid, string walletType)
    {
        var walletModel = await _context.GetWalletModelByOIdAsTrackingAsync(oid, walletType);
        walletModel.TokenBalance = tokenBalance;
        await _context.UpdateWalletModelAsync(walletModel);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> SendMonthlyTokenBasedOnRole(string oid)
    {
        var userProfileModel = await _userProfileService.GetUserByIdAsync(oid);
        double amount;
        const string walletType = "toAward";

        // Edit below to change the amount of the monthly gifted token based on the user role
        // If a user has multiple roles they should receive the highest amount of only one role,
        // so the order of the "if conditions matter
        if (userProfileModel!.Roles.Contains("Admin"))
            amount = 50;
        else if (userProfileModel.Roles.Contains("AddNewRole"))
            amount = 30;
        else
            amount = 10;
        var rpcTransactionResult = await AddTokensAsync(amount, oid, walletType);
        if (rpcTransactionResult.error != null) return false;

        await UpdateTokenBalance(amount, oid, walletType);
        await _transactionService.AddTransactionAsync(new TransactionModel(oid, walletType, "master",
            "master", amount, "MonthlyTokensGift", DateTimeOffset.UtcNow));

        return true;
    }

    public async Task<double> GetAnniversaryBonusAmountOfRoleByOIdAsync(string oid)
    {
        var userProfileModel = await _userProfileService.GetUserByIdAsync(oid);
        double amount;

        // Edit below to change the amount of the anniversary gifted token based on the user role
        // If a user has multiple roles they should receive the highest amount of only one role,
        // so the order of the "if conditions matter
        if (userProfileModel!.Roles.Contains("Admin"))
            amount = 150;
        else if (userProfileModel.Roles.Contains("AddNewRole"))
            amount = 90;
        else
            amount = 30;
        return amount;
    }

    public async Task<bool> SendAnniversaryTokenByOId(string oid)
    {
        const string walletType = "toSpend";
        if (await _context.GetWalletModelByOIdAsync(oid, walletType) == null)
        {
            return false;
        }

        var amount = GetAnniversaryBonusAmountOfRoleByOIdAsync(oid).Result;

        var rpcTransactionResult = await AddTokensAsync(amount, oid, walletType);
        if (rpcTransactionResult.error != null) return false;

        await UpdateTokenBalance(amount, oid, walletType);
        await _transactionService.AddTransactionAsync(new TransactionModel(oid, walletType, "master",
            "master", amount, "AnniversaryGift", DateTimeOffset.UtcNow));

        return true;
    }

    public async void QueueAnniversaryBonus(List<List<string>> message)
    {
        var serializedMessage = JsonSerializer.Serialize(message);
        await _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromHours(24), TimeSpan.FromSeconds(-1));
    }

    public async void QueueTokenUpdate(List<List<string>> message)
    {
        var serializedMessage = JsonSerializer.Serialize(message);
        await _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(-1));
    }

    public async void QueueSolUpdate(List<List<string>> message)
    {
        var serializedMessage = JsonSerializer.Serialize(message);
        await _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromHours(48), TimeSpan.FromSeconds(-1));
    }

    public async void QueueMonthlyTokensGift(List<List<string>> message)
    {
        var serializedMessage = JsonSerializer.Serialize(message);
        await _queueClient.SendMessageAsync(serializedMessage, TimeSpan.FromDays(7), TimeSpan.FromSeconds(-1));
    }

    public double GetSolanaAdminBalance()
    {
        return GetSolanaAdminTokenBalance() / 1000000000;
    }

    public double GetSolanaAdminTokenBalance()
    {
        var publicKey = _configuration["publicKey"];
        var rpcClient = ClientFactory.GetClient(Cluster.DevNet);
        return Convert.ToDouble(rpcClient.GetBalance(publicKey).Result.Value);
    }

    // sending notification to user using notification service
    private async Task SendNotification(string oid, UserProfileModel? userProfileModel)
    {
        var notifications = await _notificationService.GetUserNotificationsAsync(oid);
        if (userProfileModel != null && !notifications.Any())
        {
            var messageHtml = "<h1>Welcome to the team!</h1> <p>Hi " + userProfileModel.Name +
                              ",</p> <p>Thank you for joining our team. We are excited to have you on board!</p> <p>Best regards,</p> <p>Cryoto Team</p>";
            await _notificationService.SendEmailAsync(userProfileModel.Email, "Welcome to the Cryoto!",
                messageHtml, true);
            await _notificationService.SendNotificationAsync(new Notification("System", oid,
                "Welcome to the team!", "Kudos", 100));
        }
    }
}