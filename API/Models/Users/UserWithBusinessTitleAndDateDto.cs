namespace API.Models.Users;

public record UserWithBusinessTitleAndDateDto(string OId, string Name, DateTime? StartDate, string? BusinessTitle)
{
    public UserWithBusinessTitleAndDateDto(UserProfileModel userProfileModel) : this(userProfileModel.OId,
        userProfileModel.Name, userProfileModel.StartDate, userProfileModel.BusinessTitle)
    {
    }
}