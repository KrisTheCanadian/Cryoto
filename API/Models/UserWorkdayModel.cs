using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace API.Models;

public class UserWorkdayModel
{
    public UserWorkdayModel(UserProfileModel? userProfile)
    {
        UserProfile = userProfile;
    }

    public UserWorkdayModel()
    {
    }

    public string? WorkerId { get; set; }
    public string? PreferredNameData { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Company { get; set; }
    public string? SupervisoryOrganization { get; set; }
    public string? ManagerReference { get; set; }
    public string? BusinessTitle { get; set; }
    public string? CountryReference { get; set; }
    public string? CountryReferenceTwoLetter { get; set; }
    public string? PostalCode { get; set; }
    public string? PrimaryWorkTelephone { get; set; }
    public string? Fax { get; set; }
    public string? Mobile { get; set; }
    public string? LocalReference { get; set; }
    public UserProfileModel? UserProfile { get; set; }
}