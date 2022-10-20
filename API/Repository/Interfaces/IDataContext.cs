using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repository.Interfaces;

public interface IDataContext


{
    public DbSet<UserProfileModel> UserProfiles { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}