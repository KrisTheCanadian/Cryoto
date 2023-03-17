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


    public async Task<List<UserWithBusinessTitleAndDateDto>> GetSearchResultAsync(string? keywords, string oid)
    {
        // Return list of last users have been recognized by the actor once user open the search model.
        var recognizedUsersList = await GetRecognizedUsersByIdAsync(oid);
        if (keywords == null && recognizedUsersList!.Any())
        {
            return recognizedUsersList!.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();
        };

        var user = await GetUserProfileAsync(oid);
        var keywordsList = keywords!.ToLower().Split(' ')
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .ToArray();


        // Return search result from last users have been recognized by the actor.
        var searchResultList = Context.UserProfiles.AsNoTracking()
            .Where(x => recognizedUsersList!.Contains(x) && x.OId != user!.OId)
            .Search(userProfileModel => userProfileModel.Name.ToLower()).Containing(keywordsList).ToList();
        if (searchResultList.Count >= 5) return searchResultList.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();

        // Return search result from team members and manager.
        var teamMembersList = Context.UserProfiles.AsNoTracking()
            .Where(x => !searchResultList.Contains(x) && x.OId != oid)
            .Where(x => x.Name == user!.ManagerReference || x.ManagerReference == user.ManagerReference)
            .Search(userProfileModel => userProfileModel.Name.ToLower()).Containing(keywordsList).ToList();
        searchResultList = searchResultList.Concat(teamMembersList).ToList();
        if (searchResultList.Count >= 5) return searchResultList.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();

        // Return search result from the same supervisory organization.
        var supervisoryOrganizationList = Context.UserProfiles.AsNoTracking()
            .Where(x => !searchResultList.Contains(x) && x.OId != oid)
            .Where(x => x.SupervisoryOrganization == user!.SupervisoryOrganization)
            .Search(userProfileModel => userProfileModel.Name.ToLower()).Containing(keywordsList).ToList();
        searchResultList = searchResultList.Concat(supervisoryOrganizationList).ToList();
        if (searchResultList.Count >= 5) return searchResultList.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();

        // Return search result no priorities.
        var searchResultNoPrioritiesList = Context.UserProfiles.AsNoTracking()
            .Where(x => !searchResultList.Contains(x) && x.OId != oid)
            .Search(userProfileModel => userProfileModel.Name.ToLower()).Containing(keywordsList).ToList();
        searchResultList = searchResultList.Concat(searchResultNoPrioritiesList).ToList();

        return searchResultList.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();
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

    public async Task<List<UserWithBusinessTitleAndDateDto>> GetAnniversaryUsersAsync()
    {
        var userProfileModelList = await Context.UserProfiles.AsNoTracking()
            .Where(userProfile =>
                userProfile.StartDate != null
                && userProfile.StartDate.Value.ToUniversalTime().Day == DateTime.UtcNow.Day
                && userProfile.StartDate.Value.ToUniversalTime().Month == DateTime.UtcNow.Month
                && userProfile.StartDate.Value.ToUniversalTime().Year < DateTime.UtcNow.Year
            )
            .ToListAsync();
        
        return userProfileModelList.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();
    }

    public List<UserWithBusinessTitleAndDateDto> GetUpcomingAnniversaries()
    {
        var userProfileList = Context.UserProfiles.AsNoTracking()
            .Where(userProfile =>
                userProfile.StartDate != null
                && userProfile.StartDate.Value.ToUniversalTime().Year < DateTime.UtcNow.Year
                && userProfile.StartDate.Value.ToUniversalTime().Month == DateTime.UtcNow.Month
                && userProfile.StartDate.Value.ToUniversalTime().Day >= DateTime.UtcNow.Day
            )
            .ToList();

        return userProfileList.Select(x => new UserWithBusinessTitleAndDateDto(x)).ToList();
    }

    public List<TopRecognizers> GetTopRecognizers()
    {
        var authors = Context.Posts.AsNoTracking()
            .Where(post => post.CreatedDate.Month == DateTime.UtcNow.Month
                           && post.CreatedDate.Year == DateTime.UtcNow.Year)
            .AsEnumerable().GroupBy(p => p.Author)
            .Select(async p =>
            {
                var user = await GetUserByIdAsync(p.Key);
                return user != null ? new TopRecognizers(p.Count(), new UserWithBusinessTitleAndDateDto(user)) : null;
            })
            .Where(p => p != null)
            .Select(p => p.Result).OfType<TopRecognizers>()
            .OrderByDescending(p => p?.Count)
            .Take(5)
            .ToList();


        return authors;
    }

    private async Task<List<UserProfileModel>?> GetRecognizedUsersByIdAsync(string oid)
    {
        var recognizedUsersOidList = Context.Posts.Where(postModel => postModel.Author == oid)
            .Select(postModel => postModel.Recipients).ToList().SelectMany(array => array).Distinct();

        var recognizedUsersList = new List<UserProfileModel?>();

        foreach (var recipient in recognizedUsersOidList)
        {
            recognizedUsersList.Add(await Context.UserProfiles.AsNoTracking()
                .FirstOrDefaultAsync(x => x.OId.Equals(recipient)));
        }

        return recognizedUsersList!;
    }
}