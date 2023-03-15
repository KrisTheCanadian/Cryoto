using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

[ExcludeFromCodeCoverage]
public class UserRolesModel
{
    public UserRolesModel(string oId, string name, List<string>? roles)
    {
        OId = oId;
        Name = name;
        Roles = roles ?? new List<string>();
    }

    public string OId { get; set; }
    public string Name { get; set; }
    public List<string>? Roles { get; set; }
}