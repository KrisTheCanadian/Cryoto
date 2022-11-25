using System.Diagnostics.CodeAnalysis;
using API.Models.Users;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using NinjaNye.SearchExtensions;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class UserProfileRepository : IUserProfileRepository
{
    public UserProfileRepository(IDataContext context)
    {
        Context = context;
    }

    private IDataContext Context { get; set; }


    public async Task<List<UserProfileModel>> GetAllUsersAsync()
    {
        return await Context.UserProfiles.AsNoTracking().ToListAsync();
    }

    public Task<List<UserProfileModel>> GetSearchResultAsync(string keywords)
    {
        var keywordsList = keywords.ToLower().Split(' ')
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .ToArray();
        List<UserProfileModel> userProfileModelList = Context.UserProfiles.AsNoTracking()
                .Search(userProfileModel => userProfileModel.Name.ToLower()).Containing(keywordsList).ToList();
        return Task.FromResult(userProfileModelList);
    }

    public async Task<UserProfileModel?> GetUserProfileAsync(string oid)
    {
        return await Context.UserProfiles.AsNoTracking()
            .FirstOrDefaultAsync(userProfileModel => userProfileModel.OId == oid);
    }

    public async Task<int> AddUserProfileAsync(UserProfileModel userProfile)
    {
        if (await GetUserProfileAsync(userProfile.OId) != null) return 1;
        await Context.UserProfiles.AddAsync(userProfile);
        return await Context.SaveChangesAsync();
    }

    public async Task<UserProfileModel?> GetUserById(string userId)
    {
        return await Context.UserProfiles.AsNoTracking().FirstAsync(x => x.OId.Equals(userId));
    }
}