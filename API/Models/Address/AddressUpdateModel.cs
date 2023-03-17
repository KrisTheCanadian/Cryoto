using System.Diagnostics.CodeAnalysis;

namespace API.Models.Address;

[ExcludeFromCodeCoverage]
public class AddressUpdateModel
{
    public string? StreetNumber { get; set; }
    public string? Street { get; set; }
    public string? Apartment { get; set; }
    public string? AdditionalInfo { get; set; }
    public string? City { get; set; }
    public string? Province { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public bool? IsDefault { get; set; }

    public AddressUpdateModel(string? streetNumber, string? street, string? apartment, string? additionalInfo, string? city, string? province, string?  country, string? postalCode, bool? isDefault)
    {
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
}