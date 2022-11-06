using API.Crypto.Solana.SolanaObjects;
using API.Models;
using Solnet.Wallet;

namespace API.Services.Interfaces;

public interface ICryptoService
{
    public Task<List<WalletModel>> GetWalletsList();
    public Task<Wallet> GetWalletByPublicKey(string publicKey);
    public Task<Wallet> GetWalletByOIdAsync(string oid, string walletType);
    public Task<bool> CreateUserWallets(string oid);
    public Task<RpcTransactionResult?> SendTokens(double amount, string senderOId, string receiverOId);
    public Task<RpcTransactionResult> CreatePurchase(double amount, string userOId);
    public  Task<RpcTransactionResult> AddTokensAsync(double amount, string userOId, string walletType);
    public Task<double> GetTokenBalanceAsync(string oid, string walletType);
    public Task<double> GetSolanaTokenBalanceAsync(string oid, string walletType);
    public Task<bool> UpdateTokenBalance(double amount, string oid, string walletType);
    public Task<bool> UpdateSolanaTokenBalance(double tokenBalance, string oid, string walletType);
    public void QueueTokenUpdate(List<string> oIdsList);
}