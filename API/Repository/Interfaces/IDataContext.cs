using API.Models;
using API.Models.Posts;
using API.Models.WorkDay;
using Microsoft.EntityFrameworkCore;

namespace API.Repository.Interfaces;

public interface IDataContext


{
    public DbSet<UserProfileModel> UserProfiles { get; set; }
    public DbSet<PostModel> Posts { get; set; }
    public DbSet<WalletModel> Wallets { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}