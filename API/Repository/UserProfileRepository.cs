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

    private IDataContext Context { get; }


    public async Task<List<UserProfileModel>> GetAllUsersAsync()
    {
        return await Context.UserProfiles.AsNoTracking().ToListAsync();
    }

    public Task<List<UserProfileModel>> GetSearchResultAsync(string keywords)
    {
        var keywordsList = keywords.ToLower().Split(' ')
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .ToArray();
        var userProfileModelList = Context.UserProfiles.AsNoTracking()
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

    public async Task<int> UpdateUserProfile(UserProfileModel userProfile)
    {
        Context.UserProfiles.Update(userProfile);
        return await Context.SaveChangesAsync();
    }

    public async Task<UserProfileModel?> GetUserByIdAsync(string userId)
    {
        return await Context.UserProfiles.AsNoTracking().FirstAsync(x => x.OId.Equals(userId));
    }

    public async Task<bool> UpdateAsync(UserProfileModel userProfileModel)
    {
        Context.UserProfiles.Update(userProfileModel);
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task<List<UserProfileModel>> GetAnniversaryUsersAsync()
    {
        var userProfileModelList = await Context.UserProfiles.AsNoTracking()
            .Where(userProfile =>
                userProfile.StartDate != null
                && userProfile.StartDate.Value.ToUniversalTime().Day == DateTime.UtcNow.Day
                && userProfile.StartDate.Value.ToUniversalTime().Month == DateTime.UtcNow.Month
                && userProfile.StartDate.Value.ToUniversalTime().Year < DateTime.UtcNow.Year
            )
            .ToListAsync();
        return userProfileModelList;
    }

    public List<UserProfileModel> GetUpcomingAnniversaries()
    {
        var userProfileList = Context.UserProfiles.AsNoTracking()
            .Where(userProfile =>
                userProfile.StartDate != null
                && userProfile.StartDate.Value.ToUniversalTime().Year < DateTime.UtcNow.Year
                && userProfile.StartDate.Value.ToUniversalTime().Month == DateTime.UtcNow.Month
                && userProfile.StartDate.Value.ToUniversalTime().Day >= DateTime.UtcNow.Day
            )
            .ToList();

        return userProfileList;
    }

    public List<TopRecognizers> GetTopRecognizers()
    {
        var authors = Context.Posts.AsNoTracking()
            .Where(post => post.CreatedDate.Month == DateTime.UtcNow.Month
                           && post.CreatedDate.Year == DateTime.UtcNow.Year).AsEnumerable().GroupBy(p => p.Author)
            .Select(async p => new TopRecognizers(p.Count(), await GetUserByIdAsync(p.Key)))
            .Select(p => p.Result)
            .OrderByDescending(p => p.Count)
            .Take(5).ToList();

        return authors;
    }
}