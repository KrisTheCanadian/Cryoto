using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

[ExcludeFromCodeCoverage]
public class UserProfileUpdateModel
{
    public UserProfileUpdateModel(string? businessTitle, string? language, string? bio,
        bool? emailNotifications)
    {
        BusinessTitle = businessTitle;
        Language = language;
        Bio = bio;
        EmailNotifications = emailNotifications;
    }

    public string? BusinessTitle { get; set; }
    public string? Language { get; set; }
    public string? Bio { get; set; }
    public bool? EmailNotifications { get; set; }
}