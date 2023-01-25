using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using API.Models.Users;

namespace API.Models.Address;

[ExcludeFromCodeCoverage]
public class AddressCreateModel
{
    public string StreetNumber { get; set; }
    public string Street { get; set; }
    public string? Apartment { get; set; }
    public string? AdditionalInfo { get; set; }
    public string City { get; set; }
    public string Province { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    public bool? IsDefault { get; set; }

    public AddressCreateModel(string oid, string streetNumber, string street, string city, string province, string country, string postalCode, string? apartment=null, string? additionalInfo=null, bool? isDefault=null)
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