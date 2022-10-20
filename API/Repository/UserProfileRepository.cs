using API.Models;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class UserProfileRepository : IUserProfileRepository
{
    public UserProfileRepository(IDataContext context)
    {
        Context = context;
    }

    private IDataContext Context { get; set; }


    public async Task<List<UserProfileModel>> GetAllUsersAsync()
    {
        return await Context.UserProfiles.ToListAsync();
    }

    public async Task<UserProfileModel?> GetUserProfileAsync(string oid)
    {
        return await Context.UserProfiles.AsNoTracking().FirstOrDefaultAsync(x => x.OId == oid);
    }

    public async Task<int> AddUserProfileAsync(UserProfileModel userProfile)
    {
        await Context.UserProfiles.AddAsync(userProfile);
        return await Context.SaveChangesAsync();
    }
}