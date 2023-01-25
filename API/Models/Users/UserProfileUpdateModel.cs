using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

[ExcludeFromCodeCoverage]
public class UserProfileUpdateModel
{
    // public string OId { get; set; }
    public string? Name { get; set; }
    public string? BusinessTitle { get; set; }
    public string? Language { get; set; }
    public string? Bio { get; set; }
    public bool? EmailNotifications { get; set; }

    public UserProfileUpdateModel(string? name, string? businessTitle, string? language,string? bio, bool? emailNotifications)
    {
        Name = name;
        BusinessTitle = businessTitle;
        Language = language;
        Bio = bio;
        EmailNotifications = emailNotifications;
    }
}