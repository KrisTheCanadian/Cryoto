using System.Diagnostics.CodeAnalysis;
using API.Models;
using API.Models.Address;
using API.Models.Notifications;
using API.Models.Posts;
using API.Models.Transactions;
using API.Models.Users;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class DataContext : DbContext, IDataContext
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public virtual DbSet<UserProfileModel> UserProfiles { get; set; } = null!;
    public virtual DbSet<WalletModel> Wallets { get; set; } = null!;
    public virtual DbSet<AddressModel> Addresses { get; set; } = null!;
    public virtual DbSet<TransactionModel> Transactions { get; set; } = null!;
    public virtual DbSet<PostModel> Posts { get; set; } = null!;
    public virtual DbSet<Notification> Notifications { get; set; } = null!;
}