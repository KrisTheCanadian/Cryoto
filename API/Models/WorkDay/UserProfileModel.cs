using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace API.Models.WorkDay;

[ExcludeFromCodeCoverage]
public class UserProfileModel
{
    public UserProfileModel(string oId, string name, string email, string language, string[] roles)
    {
        OId = oId;
        Name = name;
        Email = email;
        Language = language;
        Roles = roles;
    }

    [Key] 
    public string OId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Language { get; set; }
    public string[] Roles { get; set; }
    public ICollection<WalletModel> Wallets { get; set; } = null!;
}