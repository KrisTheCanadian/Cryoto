using System.Diagnostics.CodeAnalysis;
using API.Models;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class WalletRepository : IWalletRepository
{
    public WalletRepository(IDataContext context)
    {
        Context = context;
    }

    private IDataContext Context { get; set; }


    public async Task<List<WalletModel>> GetWalletsModelListAsync()
    {
        return await Context.Wallets.AsNoTracking().ToListAsync();
    }

    public async Task<WalletModel> GetWalletModelByOIdAsync(string oid, string walletType)
    {
        return (await Context.Wallets
            .Where(walletModel => walletModel.OId == oid && walletModel.WalletType == walletType).AsNoTracking()
            .FirstOrDefaultAsync())!;
    }

    public async Task<WalletModel?> GetWalletModelByPublicKeyAsync(string publicKey)
    {
        return await Context.Wallets.FirstOrDefaultAsync(walletModel => walletModel.PublicKey == publicKey);
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