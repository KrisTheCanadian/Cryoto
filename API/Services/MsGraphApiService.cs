using System.Diagnostics.CodeAnalysis;
using System.Net.Http.Headers;
using System.Text;
using API.Services.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace API.Services;

[ExcludeFromCodeCoverage]
public class MsGraphApiService : IMsGraphApiService
{
    private readonly HttpClient _client = new();
    private readonly IConfiguration _configuration;
    private readonly ILogger<MsGraphApiService> _logger;


    public MsGraphApiService(IConfiguration configuration, ILogger<MsGraphApiService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> AddRolesAzureAsync(string msGraphAccessToken, string oid, string[] roles)
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", msGraphAccessToken);
        var roleIdsAsync = await GetAppRoleIdAsync(msGraphAccessToken, roles);
        var failureResponses = new List<string>();

        foreach (var requestContent in roleIdsAsync.Select(roleId => new
                 {
                     resourceId = _configuration["ResourceId"],
                     principalId = oid,
                     appRoleId = roleId
                 }).Select(requestBody =>
                     new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json")))
        {
            var response =
                await _client.PostAsync(
                    $"https://graph.microsoft.com/v1.0/users/{oid}/appRoleAssignments",
                    requestContent);

            if (!response.IsSuccessStatusCode) failureResponses.Add(await response.Content.ReadAsStringAsync());
        }

        var successResponses = failureResponses.Count <= 0;
        if (!successResponses)
            _logger.LogError("Could not add the roles {Roles} for the user {Oid}. Error: {FailureResponses}",
                roles, oid, failureResponses);

        return successResponses;
    }

    public async Task<bool> RemoveRolesAzureAsync(string msGraphAccessToken, string oid, string[] roles)
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", msGraphAccessToken);
        var roleIds = await GetAppRoleIdAsync(msGraphAccessToken, roles);
        var roleAssignments = await GetAppRoleAssignmentsAsync(msGraphAccessToken, oid, roleIds);
        var failureResponses = new List<string>();

        foreach (var roleAssignment in roleAssignments)
        {
            var response =
                await _client.DeleteAsync(
                    $"https://graph.microsoft.com/v1.0/users/{oid}/appRoleAssignments/{roleAssignment}");

            if (!response.IsSuccessStatusCode) failureResponses.Add(await response.Content.ReadAsStringAsync());
        }

        var successResponses = failureResponses.Count <= 0;
        if (!successResponses)
            _logger.LogError("Could not remove the roles {Roles} for the user {Oid}. Error: {FailureResponses}",
                roles, oid, failureResponses);

        return successResponses;
    }

    public async Task<List<string>?> GetAzureUserRolesAsync(string msGraphAccessToken, string oid)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", msGraphAccessToken);

        var response =
            await client.GetAsync(
                $"https://graph.microsoft.com/v1.0/users/{oid}/appRoleAssignments");
        if (!response.IsSuccessStatusCode) return null;

        var data = await response.Content.ReadAsStringAsync()
            .ContinueWith(task => JsonConvert.DeserializeObject<JObject>(task.Result));
        var rolesIds = data!["value"]!.Select(x => (string)x["appRoleId"]!).Distinct().ToArray();

        return await GetAppRoleDisplayNamesAsync(msGraphAccessToken, rolesIds);
    }

    private async Task<List<string>?> GetAppRoleDisplayNamesAsync(string msGraphAccessToken, string[] rolesIds)
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", msGraphAccessToken);

        var response =
            await _client.GetAsync(
                $"https://graph.microsoft.com/v1.0/applications/{_configuration["ObjectID"]}/appRoles");
        var data = await response.Content.ReadAsStringAsync()
            .ContinueWith(task => JsonConvert.DeserializeObject<JObject>(task.Result));

        var rolesDisplayNames = data!["value"]!
            .Where(role => rolesIds.Contains(role["id"]!.ToString()))
            .Select(role => role["displayName"]!.ToString())
            .ToList();

        return rolesDisplayNames;
    }

    private async Task<List<string>> GetAppRoleIdAsync(string msGraphAccessToken, string[] rolesDisplayNames)
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", msGraphAccessToken);

        var response =
            await _client.GetAsync(
                $"https://graph.microsoft.com/v1.0/applications/{_configuration["ObjectID"]}/appRoles");
        var data = await response.Content.ReadAsStringAsync()
            .ContinueWith(task => JsonConvert.DeserializeObject<JObject>(task.Result));

        var rolesIds = data!["value"]!
            .Where(role => rolesDisplayNames.Contains(role["displayName"]!.ToString()))
            .Select(role => role["id"]!.ToString())
            .ToList();

        return rolesIds;
    }

    private async Task<List<string>> GetAppRoleAssignmentsAsync(string msGraphAccessToken, string oid,
        ICollection<string> roleIds)
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", msGraphAccessToken);
        var response =
            await _client.GetAsync(
                $"https://graph.microsoft.com/v1.0/users/{oid}/appRoleAssignments");

        var data = await response.Content.ReadAsStringAsync()
            .ContinueWith(task => JsonConvert.DeserializeObject<JObject>(task.Result));

        var roleAssignments = data!["value"]!
            .Where(role => roleIds.Contains(role["appRoleId"]!.ToString()))
            .Select(role => role["id"]!.ToString())
            .ToList();

        return roleAssignments;
    }
}