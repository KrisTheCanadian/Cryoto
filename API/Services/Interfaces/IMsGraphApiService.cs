namespace API.Services.Interfaces;

public interface IMsGraphApiService
{
    public Task<bool> AddRolesAzureAsync(string msGraphAccessToken, string oid, string[] roles);
    public Task<bool> RemoveRolesAzureAsync(string msGraphAccessToken, string oid, string[] roles);
    public Task<List<string>?> GetAzureUserRolesAsync(string msGraphAccessToken, string oid);
}