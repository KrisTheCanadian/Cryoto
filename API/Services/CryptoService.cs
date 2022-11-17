using API.Crypto.Services.Interfaces;
using API.Crypto.Solana.SolanaObjects;
using API.Models;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using Azure.Storage.Queues;
using Solnet.Wallet;
using System.Text.Json;


namespace API.Services;

public class CryptoService : ICryptoService
{
    private readonly IWalletRepository _context;
    private readonly ISolanaService _solanaService;
    private readonly IConfiguration _configuration;
    private readonly QueueClient _queueClient;


    public CryptoService(IWalletRepository context, ISolanaService solanaService, IConfiguration configuration,
        QueueClient queueClient)
    {
        _context = context;
        _solanaService = solanaService;
        _configuration = configuration;
        _queueClient = queueClient;
    }

    public async Task<List<WalletModel>> GetWalletsList()
    {
        return await _context.GetWalletsModelListAsync();
    }

    public async Task<Wallet> GetWalletByPublicKey(string publicKey)
    {
        var encryptedWallet = await _context.GetWalletModelByPublicKeyAsync(publicKey);
        return _solanaService.DecryptWallet(encryptedWallet!.Wallet, encryptedWallet.OId);
    }

    public Wallet GetOwnerWallet()
    {
        return _solanaService.GetWallet(_configuration["OwnerWallet-Mnemonics"],
            _configuration["OwnerWallet-Passphrase"]);
    }

    public async Task<Wallet> GetWalletByOIdAsync(string oid, string walletType)
    {
        var walletModel = await _context.GetWalletModelByOIdAsync(oid, walletType);
        return _solanaService.DecryptWallet(walletModel.Wallet, oid);
    }

    public async Task<PublicKey> GetPublicKeyByOIdAsync(string oid, string walletType)
    {
        var walletModel = await _context.GetWalletModelByOIdAsync(oid, walletType);
        return _solanaService.GetPublicKeyFromString(walletModel.PublicKey);
    }

    public async Task<bool> CreateUserWallets(string oid)
    {
        var toSpendWallet = _solanaService.CreateWallet();
        var toAwardWallet = _solanaService.CreateWallet();

        var toSpendWalletEncrypted = _solanaService.EncryptWallet(toSpendWallet, oid);
        var toAwardWalletEncrypted = _solanaService.EncryptWallet(toAwardWallet, oid);

        var toSpendWalletPublicKey = toSpendWallet.Account.PublicKey;
        var toAward = toAwardWallet.Account.PublicKey;

        var toSpendWalletModel = new WalletModel(toSpendWalletPublicKey, toSpendWalletEncrypted, oid, "toSpend", 0);
        var toAwardWalletModel = new WalletModel(toAward, toAwardWalletEncrypted, oid, "toAward", 0);

        return await _context.AddWalletModelAsync(toSpendWalletModel) > 0 &&
               await _context.AddWalletModelAsync(toAwardWalletModel) > 0;
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

    public async Task<double> GetTokenBalanceAsync(string oid, string walletType)
    {
        var walletModel = await _context.GetWalletModelByOIdAsync(oid, walletType);
        return walletModel.TokenBalance;
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
}