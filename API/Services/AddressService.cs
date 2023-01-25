using API.Models.Address;
using API.Repository.Interfaces;
using API.Services.Interfaces;

namespace API.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _context;

    public AddressService(IAddressRepository context)
    {
        _context = context;
    }

    public async Task<bool> CreateAddressAsync(AddressModel addressModel)
    {
        return await _context.CreateAddressAsync(addressModel);
    }

    public async Task<bool> DeleteAddressAsync(AddressModel addressModel)
    {
        return await _context.DeleteAddressAsync(addressModel);
    }

    public async Task<AddressModel?> GetDefaultAddressByOIdAsync(string oid)
    {
        return await _context.GetDefaultAddressByOIdAsync(oid);
    }
    
    public async Task<List<AddressModel>> GetAllAddressesAsync()
    {
        return await _context.GetAllAddressesAsync();
    }

    public async Task<AddressModel?> GetAddressByIdAsync(long id)
    {
        return await _context.GetAddressByIdAsync(id);
    }

    public async Task<List<AddressModel>> GetAllAddressesByOIdAsync(string oid)
    {
        return await _context.GetAllAddressesByOIdAsync(oid);
    }
    
    public async Task<bool> UpdateAddressAsync(AddressModel addressModel)
    {
        return await _context.UpdateAddressAsync(addressModel);
    }
}