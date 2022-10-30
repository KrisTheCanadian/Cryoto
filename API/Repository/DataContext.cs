using API.Models.Posts;
using API.Models.WorkDay;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class DataContext : DbContext, IDataContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) {}
    public DbSet<UserProfileModel> UserProfiles { get; set; } = null!;
    public DbSet<PostModel> Posts { get; set; } = null!;
}