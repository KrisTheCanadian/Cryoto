using API.Models;
using API.Models.Users;

namespace API.Repository.Interfaces;

public interface IWalletRepository


{
    public Task<WalletModel?> GetWalletModelByOIdAsync(string oid, string walletType);
    public Task<WalletModel> GetWalletModelByOIdAsTrackingAsync(string oid, string walletType);
    public Task<int> AddWalletModelAsync(WalletModel wallet);
    public Task<bool> UpdateWalletModelAsync(WalletModel wallet);
    public Task<int> SaveChangesAsync();
}