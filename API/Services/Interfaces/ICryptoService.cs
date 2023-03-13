using System.Security.Claims;
using API.Crypto.Solana.SolanaObjects;
using API.Models;
using API.Models.Users;
using Solnet.Wallet;

namespace API.Services.Interfaces;

public interface ICryptoService
{
    public Task<RpcTransactionResult?> SendTokens(double amount, string senderOId, string receiverOId);
    public Task<RpcTransactionResult> SelfTransferTokens(double amount, string userOId);
    public Task<RpcTransactionResult> CreatePurchase(double amount, string userOId);
    public Task<RpcTransactionResult> AddTokensAsync(double amount, string userOId, string walletType);
    public Task<UserWalletsModel> GetWalletsBalanceAsync(string oid, ClaimsIdentity? user = null);
    public double GetTokenBalanceAsync(string oid, string walletType);
    public Task<double> GetSolanaTokenBalanceAsync(string oid, string walletType);
    public Task<bool> UpdateTokenBalance(double amount, string oid, string walletType);
    public Task<bool> SendMonthlyTokenBasedOnRole(string oid);
    public Task<bool> UpdateSolanaTokenBalance(double tokenBalance, string oid, string walletType);
    public void QueueTokenUpdate(List<List<string>> message);
    public void QueueSolUpdate(List<List<string>> message);
    public void QueueMonthlyTokensGift(List<List<string>> message);
    public double GetSolanaAdminBalance();
    public double GetSolanaAdminTokenBalance();
    public Task<double> GetAnniversaryBonusAmountOfRoleByOIdAsync(string oid);
    public Task<bool> SendAnniversaryTokenByOId(string oid);
    public void QueueAnniversaryBonus(List<List<string>> message);
    public Task<bool> BoostRecognition(string senderId, List<string> recipientIds);
}