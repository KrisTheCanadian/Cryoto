using System.Diagnostics.CodeAnalysis;
using API.Models.Address;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

[ExcludeFromCodeCoverage]
public class AddressRepository : IAddressRepository
{
    public AddressRepository(IDataContext context)
    {
        Context = context;
    }

    private IDataContext Context { get; }

    public async Task<List<AddressModel>> GetAllAddressesByOIdAsync(string oid)
    {
        return await Context.Addresses.AsNoTracking().Where(address => address.OId == oid).ToListAsync();
    }

    public async Task<List<AddressModel>> GetAllAddressesAsync()
    {
        return await Context.Addresses.AsNoTracking().ToListAsync();
    }

    public async Task<AddressModel?> GetAddressByIdAsync(long id)
    {
        return await Context.Addresses.AsNoTracking().FirstOrDefaultAsync(address => address.Id == id);
    }

    public async Task<AddressModel?> GetDefaultAddressByOIdAsync(string oid)
    {
        return await Context.Addresses.AsNoTracking()
            .FirstOrDefaultAsync(address => address.OId == oid && address.IsDefault == true);
    }

    public async Task<bool> CreateAddressAsync(AddressModel addressModel)
    {
        await Context.Addresses.AddAsync(addressModel);
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAddressAsync(AddressModel addressModel)
    {
        Context.Addresses.Remove(addressModel);
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAddressAsync(AddressModel addressModel)
    {
        Context.Addresses.Update(addressModel);
        return await Context.SaveChangesAsync() > 0;
    }
}