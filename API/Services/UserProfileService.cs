﻿using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using API.Models.Users;
using API.Repository.Interfaces;
using API.Services.Interfaces;
using Microsoft.Identity.Web;
using Newtonsoft.Json;

namespace API.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IUserProfileRepository _context;
    private readonly IPostRepository _postContext;
    private readonly HttpClient _client = new HttpClient();

    public UserProfileService(IUserProfileRepository context, IPostRepository postContext)
    {
        _context = context;
        _postContext = postContext;
    }

    [ExcludeFromCodeCoverage]
    public async Task<UserProfileModel?> GetOrAddUserProfileService(string oid, ClaimsIdentity? identity)
    {
        // Return userProfile if it is already exist.
        var userProfileModel = await _context.GetUserProfileAsync(oid);
        if (userProfileModel != null) return userProfileModel;

        // Create new userProfile if it does not exist.
        var uri = new Uri("https://my.api.mockaroo.com/workday.json?key=f8e15420");
        var mockarooResponse = await _client.GetStringAsync(uri);
        userProfileModel = JsonConvert.DeserializeObject<UserProfileModel>(mockarooResponse);

        userProfileModel!.OId = oid;
        userProfileModel.Name = identity?.FindFirst(ClaimConstants.Name)?.Value!;
        userProfileModel.Email = identity?.FindFirst(ClaimConstants.PreferredUserName)?.Value!;
        userProfileModel.Language = "en";
        userProfileModel.Roles = identity?.FindAll(ClaimConstants.Role).Select(x => x.Value).ToArray()!;
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

    public async Task UpdateUserProfilesRecognitionsCount()
    {
        var userProfileModels = await _context.GetAllUsersAsync();
        foreach (var userProfileModel in userProfileModels)
        {
            userProfileModel.RecognitionsReceived = await _postContext.GetReceivedPostsCountAsync(userProfileModel.OId);
            userProfileModel.RecognitionsSent = await _postContext.GetSentPostsCountAsync(userProfileModel.OId);
            await _context.UpdateUserProfile(userProfileModel);
        }
    }

    public async Task<bool> IncrementRecognitionsSent(string oid)
    {
        var userProfileModel = await _context.GetUserByIdAsync(oid);
        userProfileModel!.RecognitionsSent = userProfileModel.RecognitionsSent + 1;
        return await _context.UpdateUserProfile(userProfileModel) > 1;
    }

    public async Task<bool> IncrementRecognitionsReceived(string oid)
    {
        var userProfileModel = await _context.GetUserByIdAsync(oid);
        userProfileModel!.RecognitionsReceived = userProfileModel.RecognitionsReceived + 1;
        return await _context.UpdateUserProfile(userProfileModel) > 1;
    }

    public async Task<List<UserProfileModel>> GetAllUsersService()
    {
        return await _context.GetAllUsersAsync();
    }

    public async Task<List<UserProfileModel>> GetSearchResultServiceAsync(string keywords)
    {
        return await _context.GetSearchResultAsync(keywords);
    }

    public async Task<UserProfileModel?> GetUserByIdAsync(string userId)
    {
        return await _context.GetUserByIdAsync(userId);
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
        userProfileModel.Company = fakeUserProfileModel!.Company;
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