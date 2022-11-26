using API.Models;
using API.Models.Notifications;
using API.Models.Posts;
using API.Models.Transactions;
using API.Models.Users;
using Microsoft.EntityFrameworkCore;

namespace API.Repository.Interfaces;

public interface IDataContext


{
    public DbSet<UserProfileModel> UserProfiles { get; set; }
    public DbSet<PostModel> Posts { get; set; }
    public DbSet<WalletModel> Wallets { get; set; }
    public DbSet<TransactionModel> Transactions { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}