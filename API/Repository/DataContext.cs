using System.Diagnostics.CodeAnalysis;
using API.Models;
using API.Models.Posts;
using API.Models.WorkDay;
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
    public DbSet<PostModel> Posts { get; set; } = null!;
}