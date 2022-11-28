namespace API.Models.Users;

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

