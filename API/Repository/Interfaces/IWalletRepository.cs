using API.Models;
using API.Models.Users;

namespace API.Repository.Interfaces;

public interface IWalletRepository


{
    public Task<List<WalletModel>> GetWalletsModelListAsync();
    public Task<WalletModel?> GetWalletModelByOIdAsync(string oid, string walletType);
    public Task<WalletModel> GetWalletModelByOIdAsTrackingAsync(string oid, string walletType);
    public Task<WalletModel?> GetWalletModelByPublicKeyAsync(string publicKey);
    public Task<int> AddWalletModelAsync(WalletModel wallet);
    public Task<bool> UpdateWalletModelAsync(WalletModel wallet);
    public Task<int> SaveChangesAsync();
}