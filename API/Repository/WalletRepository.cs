using System.Diagnostics.CodeAnalysis;
using API.Models;
using API.Models.Users;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class WalletRepository : IWalletRepository
{
    private IDataContext Context { get; set; }

    public WalletRepository(IDataContext context)
    {
        Context = context;
    }

    public async Task<WalletModel?> GetWalletModelByOIdAsync(string oid, string walletType)
    {
        return (await Context.Wallets.AsNoTracking()
            .FirstOrDefaultAsync(walletModel => walletModel.OId == oid && walletModel.WalletType == walletType))!;
    }

    public async Task<WalletModel> GetWalletModelByOIdAsTrackingAsync(string oid, string walletType)
    {
        return (await Context.Wallets
            .FirstOrDefaultAsync(walletModel => walletModel.OId == oid && walletModel.WalletType == walletType))!;
    }


    public async Task<int> AddWalletModelAsync(WalletModel wallet)
    {
        await Context.Wallets.AddAsync(wallet);
        return await SaveChangesAsync();
    }

    public async Task<bool> UpdateWalletModelAsync(WalletModel wallet)
    {
        Context.Wallets.Update(wallet);
        return await SaveChangesAsync() > 0;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await Context.SaveChangesAsync();
    }
}