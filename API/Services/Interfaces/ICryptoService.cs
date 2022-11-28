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
    public  Task<RpcTransactionResult> AddTokensAsync(double amount, string userOId, string walletType);
    public Task<UserWalletsModel> GetWalletsBalanceAsync(string oid, ClaimsIdentity? user= null );
    public Task<double> GetTokenBalanceAsync(string oid, string walletType);
    public double GetSolBalance();
    public Task<double> GetSolanaTokenBalanceAsync(string oid, string walletType);
    public Task<bool> UpdateTokenBalance(double amount, string oid, string walletType);
    public Task<bool> UpdateSolanaTokenBalance(double tokenBalance, string oid, string walletType);
    public void QueueTokenUpdate(List<string> oIdsList);
    public void QueueSolUpdate(List<string> oIdsList);
}