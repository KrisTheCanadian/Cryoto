using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

[ExcludeFromCodeCoverage]
public record UserDto(string OId, string Name)
{
    public UserDto(UserProfileModel userProfileModel) : this(userProfileModel.OId, userProfileModel.Name)
    {
    }
}