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
    {   // Return wallet if it is already exist.
        var walletModel = await _context.GetWalletModelByOIdAsync(oid, walletType);
        if (walletModel !=null)
            return walletModel;
        
        // Creat new wallet if it does not exist.
        var wallet = _solanaService.CreateWallet();
        var walletEncrypted = _solanaService.EncryptWallet(wallet, oid);
        var walletPublicKey = wallet.Account.PublicKey;
        walletModel = new WalletModel(walletPublicKey, walletEncrypted, oid, walletType, 100);
        
        if (await _context.AddWalletModelAsync(walletModel) <= 0) return null;
        
        
        
        await AddTokensAsync(100, oid, walletType);
        await _transactionService.AddTransactionAsync(new TransactionModel(oid, walletType, "master",
            "master", 100, "WelcomeTransfer", DateTimeOffset.UtcNow));
        
        var userProfileModel = await _userProfileService.GetUserByIdAsync(oid);
        
        // quick fix for double notification
        // get notifications of user and check if it's empty
        using (var mutex = new Mutex(false, "NotificationMutex"))
        {
            try
            {
                mutex.WaitOne();
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

                mutex.ReleaseMutex();
            }
            catch (Exception)
            {
                // making sure mutex is released in case of exception
                mutex.ReleaseMutex();
            }
        }

        
        QueueTokenUpdate(new List<string> { oid, oid });
        return walletModel;

    }
    
    public async Task<UserWalletsModel> GetWalletsBalanceAsync(string oid, ClaimsIdentity? user = null)
    {
        // Create userProfile if it has not been created before.
        var profile = await _userProfileService.GetOrAddUserProfileService(oid, user);
        
        var toSpendBalance = await GetTokenBalanceAsync(oid, "toSpend");
        var toAwardBalance = await GetTokenBalanceAsync(oid, "toAward");
        var userWalletsModel = new UserWalletsModel(toAwardBalance, toSpendBalance);

        return userWalletsModel;
    }
    
    public async Task<double> GetTokenBalanceAsync(string oid, string walletType)
    {
        var walletModel = await GetOrCreateUserWallet(oid, walletType);
        return walletModel?.TokenBalance ?? 0;
    }
    public async Task<RpcTransactionResult?> SendTokens(double amount, string senderOId, string receiverOId)
    {
        var senderWallet = await GetWalletByOIdAsync(senderOId, "toAward");
        var receiverWallet = await GetWalletByOIdAsync(receiverOId, "toSpend");
        var ownerWallet = GetOwnerWallet();
        var receiverPublicKey = receiverWallet.Account.PublicKey;
        var rpcTransactionResult = _solanaService.SendTokens(amount, senderWallet, ownerWallet, receiverPublicKey,
            _configuration["tokenAddress"]);
        if(rpcTransactionResult.error != null)
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

    public async void QueueTokenUpdate(List<string> oIdsList)
    {
        var message = JsonSerializer.Serialize(oIdsList);
        await _queueClient.SendMessageAsync(message, TimeSpan.FromSeconds(90), TimeSpan.FromSeconds(-1));
    }
    
    public async void QueueSolUpdate(List<string> oIdsList)
    {
        var message = JsonSerializer.Serialize(oIdsList);
        await _queueClient.SendMessageAsync(message, TimeSpan.FromHours(48), TimeSpan.FromSeconds(-1));
    }
    
    public double GetSolBalance()
    {
        var publicKey = "HgRdHMtBLZRfLjbjyq8d38LFx3fC2DbVgzjUbKx4VQ4Y";
        IRpcClient RpcClient = ClientFactory.GetClient(Cluster.DevNet);
        return Convert.ToDouble(RpcClient.GetBalance(publicKey).Result.Value)/1000000000;
    }
}