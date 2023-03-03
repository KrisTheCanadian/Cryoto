using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

[ExcludeFromCodeCoverage]
public record TopRecognizers(int Count, UserProfileModel? UserProfile);