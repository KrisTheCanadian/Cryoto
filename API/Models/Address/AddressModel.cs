using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using API.Models.Users;

namespace API.Models.Address;

[ExcludeFromCodeCoverage]
public class AddressModel
{
    [Key] public long Id { get; set; }
    [ForeignKey("UserProfileModel")] public string OId { get; set; }
    [Required] public string StreetNumber { get; set; }
    [Required] public string Street { get; set; }
    public string? Apartment { get; set; }
    public string? AdditionalInfo { get; set; }
    [Required] public string City { get; set; }
    [Required] public string Province { get; set; }
    [Required] public string Country { get; set; }
    [Required] public string PostalCode { get; set; }
    public bool? IsDefault { get; set; }
    [NotMapped] public UserProfileModel? UserProfile { get; set; }

    public AddressModel(string oId)
    {
        OId = oId;
        StreetNumber = "";
        Street = "";
        Apartment = null;
        AdditionalInfo = null;
        City = "";
        Province = "";
        Country = "";
        PostalCode = "";
        IsDefault = null;
    }
    
    public AddressModel(string oId, string streetNumber, string street, string city, string province, string country, string postalCode, string? apartment=null, string? additionalInfo=null, bool? isDefault=null)
    {
        OId = oId;
        StreetNumber = streetNumber;
        Street = street;
        Apartment = apartment;
        AdditionalInfo = additionalInfo;
        City = city;
        Province = province;
        Country = country;
        PostalCode = postalCode;
        IsDefault = isDefault;
    }
    
    public AddressModel(string oId, AddressCreateModel addressCreateModel)
    {
        OId = oId;
        StreetNumber = addressCreateModel.StreetNumber;
        Street = addressCreateModel.Street;
        Apartment = addressCreateModel.Apartment;
        AdditionalInfo = addressCreateModel.AdditionalInfo;
        City = addressCreateModel.City;
        Province = addressCreateModel.Province;
        Country = addressCreateModel.Country;
        PostalCode = addressCreateModel.PostalCode;
        IsDefault = addressCreateModel.IsDefault;
    }
}