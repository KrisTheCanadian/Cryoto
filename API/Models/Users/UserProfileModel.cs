using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace API.Models.Users;

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
        EmailNotifications = true;
    }

    [Key] public string OId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Language { get; set; }
    public string[] Roles { get; set; }
    public bool EmailNotifications { get; set; }

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
    public string? Bio { get; set; }
    public string? TimeZone { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? Birthday { get; set; }
    public string? City { get; set; }
    [DefaultValue(0)] public int RecognitionsReceived { get; set; }
    [DefaultValue(0)] public int RecognitionsSent { get; set; }
}