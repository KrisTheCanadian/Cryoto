using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using Microsoft.Identity.Web;
using Newtonsoft.Json;

namespace API.Services;

public class UserProfileService : IUserProfileService
{
    private readonly HttpClient _client = new();
    private readonly IUserProfileRepository _context;
    private readonly IMsGraphApiService _msGraphApiService;


    public UserProfileService(IUserProfileRepository context,
        IMsGraphApiService msGraphApiService)
    {
        _context = context;
        _msGraphApiService = msGraphApiService;
    }

    [ExcludeFromCodeCoverage]
    public async Task<UserProfileModel?> GetOrAddUserProfileService(string oid, ClaimsIdentity? user)
    {
        // Return userProfile if it is already exist.
        var userProfileModel = await _context.GetUserProfileAsync(oid);
        if (userProfileModel != null) return userProfileModel;

        // Create new userProfile if it does not exist.
        var uri = new Uri("https://my.api.mockaroo.com/workday.json?key=f8e15420");
        var mockarooResponse = await _client.GetStringAsync(uri);
        userProfileModel = JsonConvert.DeserializeObject<UserProfileModel>(mockarooResponse);

        userProfileModel!.OId = oid;
        userProfileModel.Name = user?.FindFirst(ClaimConstants.Name)?.Value!;
        userProfileModel.Email = user?.FindFirst(ClaimConstants.PreferredUserName)?.Value!;
        userProfileModel.Language = "en";
        userProfileModel.Roles = user?.FindAll(ClaimConstants.Role).Select(x => x.Value).ToArray()!;
        userProfileModel.StartDate = FakeStartDate();
        userProfileModel.Birthday = FakeBirthday();

        return await _context.AddUserProfileAsync(userProfileModel) <= 0 ? null : userProfileModel;
    }

    public async Task UpdateUserProfileFakeData()
    {
        var users = await _context.GetAllUsersAsync();
        // Create new userProfile if it does not exist.
        var uri = new Uri("https://my.api.mockaroo.com/workday100.json?key=c4fdbe70");
        var mockarooResponse = await _client.GetStringAsync(uri);
        var fakeUserProfileModel = JsonConvert.DeserializeObject<List<UserProfileModel>>(mockarooResponse);

        foreach (var userProfileModel in users.Select((value, index) => new { index, value }))
        {
            var updatedUserProfileModel =
                MapUserProfileModel(userProfileModel.value, fakeUserProfileModel![userProfileModel.index]);
            await _context.UpdateUserProfile(updatedUserProfileModel);
        }
    }

    public async Task<bool> IncrementRecognitionsSent(string oid)
    {
        var userProfileModel = await _context.GetUserByIdAsync(oid);
        userProfileModel!.RecognitionsSent = userProfileModel.RecognitionsSent + 1;
        return await _context.UpdateUserProfile(userProfileModel) > 0;
    }

    public async Task<bool> IncrementRecognitionsReceived(string oid)
    {
        var userProfileModel = await _context.GetUserByIdAsync(oid);
        userProfileModel!.RecognitionsReceived = userProfileModel.RecognitionsReceived + 1;
        return await _context.UpdateUserProfile(userProfileModel) > 0;
    }

    public async Task<List<UserWithBusinessTitleAndDateDto>?> GetSearchResultServiceAsync(string? keywords, string oid)
    {
        return await _context.GetSearchResultAsync(keywords, oid);
    }

    public async Task<UserProfileModel?> GetUserByIdAsync(string userId)
    {
        return await _context.GetUserByIdAsync(userId);
    }

    public async Task<bool> UpdateAsync(UserProfileModel userProfileModel)
    {
        return await _context.UpdateAsync(userProfileModel);
    }

    public async Task<List<UserWithBusinessTitleAndDateDto>> GetAnniversaryUsersAsync()
    {
        return await _context.GetAnniversaryUsersAsync();
    }

    public List<UserWithBusinessTitleAndDateDto> GetUpcomingAnniversaries()
    {
        return _context.GetUpcomingAnniversaries();
    }

    public List<TopRecognizers> GetTopRecognizers()
    {
        return _context.GetTopRecognizers();
    }

    public async Task<bool> UpdateUserRolesService(string msGraphAccessToken, string oid, string[] roles)
    {
        var userProfileModel = await GetUserByIdAsync(oid);
        var userRolesDb = await _msGraphApiService.GetAzureUserRolesAsync(msGraphAccessToken, oid);
        var rolesToBeDeleted = userRolesDb!.Except(roles).ToArray();
        var rolesToBeAdded = roles.Except(userRolesDb!).ToArray();
        var removedRolesSuccessfully = false;
        var addedRolesSuccessfully = false;

        if (rolesToBeAdded.Length > 0)
            addedRolesSuccessfully =
                await _msGraphApiService.AddRolesAzureAsync(msGraphAccessToken, oid, rolesToBeAdded);
        if (rolesToBeDeleted.Length > 0)
            removedRolesSuccessfully =
                await _msGraphApiService.RemoveRolesAzureAsync(msGraphAccessToken, oid, rolesToBeDeleted);

        var successResponses = (rolesToBeAdded.Length > 0 && addedRolesSuccessfully) ||
                               (rolesToBeDeleted.Length > 0 && removedRolesSuccessfully);
        if (!successResponses) return successResponses;

        userProfileModel!.Roles = roles;
        // This is used as a cache to store the user role in the DB for faster retrieve.
        await _context.UpdateUserProfile(userProfileModel);

        return successResponses;
    }

    public async Task<List<UserRolesModel>> GetAllUsersRolesServiceAsync(string msGraphAccessToken)
    {
        List<UserRolesModel> userRolesModelList = new();
        var allUsersProfileModelList = await _context.GetAllUsersAsync();
        foreach (var user in allUsersProfileModelList)
        {
            var userRoles = await _msGraphApiService.GetAzureUserRolesAsync(msGraphAccessToken, user.OId);
            userRolesModelList.Add(new UserRolesModel(user.OId, user.Name, userRoles));
        }

        return userRolesModelList;
    }

    public async Task<List<UserRolesModel>> GetAllUsersRolesDbServiceAsync()
    {
        var allUsersProfileModelList = await _context.GetAllUsersAsync();

        return allUsersProfileModelList
            .Select(user => new UserRolesModel(user.OId, user.Name, new List<string>(user.Roles))).ToList();
    }

    private static DateTime FakeStartDate()
    {
        var start = new DateTime(1987, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = DateTime.UtcNow;
        return FakeDate(start, end);
    }

    private static DateTime FakeBirthday()
    {
        var start = DateTime.UtcNow.AddYears(-80);
        var end = DateTime.UtcNow.AddYears(-16);
        return FakeDate(start, end);
    }

    private static DateTime FakeDate(DateTime start, DateTime end)
    {
        var rnd = new Random();
        var range = end - start;
        return start + new TimeSpan((long)(range.Ticks * rnd.NextDouble()));
    }

    private static UserProfileModel MapUserProfileModel(UserProfileModel userProfileModel,
        UserProfileModel fakeUserProfileModel)
    {
        userProfileModel.Company = fakeUserProfileModel.Company;
        userProfileModel.SupervisoryOrganization = fakeUserProfileModel.SupervisoryOrganization;
        userProfileModel.ManagerReference = fakeUserProfileModel.ManagerReference;
        userProfileModel.BusinessTitle = fakeUserProfileModel.BusinessTitle;
        userProfileModel.CountryReference = fakeUserProfileModel.CountryReference;
        userProfileModel.CountryReferenceTwoLetter = fakeUserProfileModel.CountryReferenceTwoLetter;
        userProfileModel.PostalCode = fakeUserProfileModel.PostalCode;
        userProfileModel.PrimaryWorkTelephone = fakeUserProfileModel.PrimaryWorkTelephone;
        userProfileModel.Fax = fakeUserProfileModel.Fax;
        userProfileModel.Mobile = fakeUserProfileModel.Mobile;
        userProfileModel.TimeZone = fakeUserProfileModel.TimeZone;
        userProfileModel.City = fakeUserProfileModel.City;
        userProfileModel.StartDate = FakeStartDate();
        userProfileModel.Birthday = FakeBirthday();

        return userProfileModel;
    }
}