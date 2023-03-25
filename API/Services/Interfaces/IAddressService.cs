using API.Models.Address;

namespace API.Services.Interfaces;

public interface IAddressService
{
    public Task<bool> CreateAddressAsync(AddressModel addressModel);
    public Task<bool> DeleteAddressAsync(AddressModel addressModel);
    public Task<AddressModel?> GetDefaultAddressByOIdAsync(string oid);
    public Task<AddressModel?> GetAddressByIdAsync(long id);
    public Task<bool> UpdateAddressAsync(AddressModel addressModel);
}