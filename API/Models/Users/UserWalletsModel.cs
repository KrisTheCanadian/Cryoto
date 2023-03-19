using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

[ExcludeFromCodeCoverage]
public class UserWalletsModel
{
    public UserWalletsModel(double toAwardBalance, double toSpendBalance)
    {
        ToAwardBalance = toAwardBalance;
        ToSpendBalance = toSpendBalance;
    }

    public double ToAwardBalance { get; set; }
    public double ToSpendBalance { get; set; }
}