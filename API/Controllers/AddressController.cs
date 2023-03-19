using System.Security.Claims;
using API.Models.Address;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class AddressController : ControllerBase
{
    private readonly IAddressService _addressService;
    private readonly string _oId;

    public AddressController(IAddressService addressService, IHttpContextAccessor contextAccessor)
    {
        _addressService = addressService;
        var identity = contextAccessor.HttpContext!.User.Identity as ClaimsIdentity;
        _oId = identity?.FindFirst(ClaimConstants.ObjectId)?.Value!;
    }

    [HttpGet]
    public async Task<ActionResult<AddressModel>> GetDefaultAddressOrCreate()
    {
        var address = await _addressService.GetDefaultAddressByOIdAsync(_oId);
        if (address == null)
        {
            var newAddress = new AddressModel(_oId);
            newAddress.IsDefault = true;
            var createdSuccessfully = await _addressService.CreateAddressAsync(newAddress);
            if (!createdSuccessfully) return Problem("Could not create a blank default address.");

            address = await _addressService.GetDefaultAddressByOIdAsync(_oId);
        }

        return Ok(address);
    }

    [HttpGet]
    public async Task<ActionResult<AddressModel>> GetDefaultAddress()
    {
        var address = await _addressService.GetDefaultAddressByOIdAsync(_oId);
        return Ok(address);
    }

    [HttpPost]
    public async Task<ActionResult<AddressModel>> Add(AddressCreateModel addressCreateModel)
    {
        var addressModel = new AddressModel(_oId, addressCreateModel);
        var result = await _addressService.CreateAddressAsync(addressModel);
        if (result) return Ok(await _addressService.GetAddressByIdAsync(addressModel.Id));

        return BadRequest("Couldn't create address.");
    }

    [HttpDelete]
    public async Task<ActionResult<AddressModel>> Delete(long id)
    {
        var addressModel = await _addressService.GetAddressByIdAsync(id);
        if (addressModel == null) return BadRequest("Address doesn't exist.");

        var result = await _addressService.DeleteAddressAsync(addressModel);
        if (result) return Ok(addressModel);

        return BadRequest("Couldn't delete address.");
    }

    [HttpPut]
    public async Task<ActionResult<AddressModel>> Update(long id, AddressUpdateModel addressUpdateModel)
    {
        var addressModel = await _addressService.GetAddressByIdAsync(id);
        if (addressModel == null) return BadRequest("Address doesn't exist.");

        var changeCounter = 0;

        // set new attributes 
        if (addressUpdateModel.StreetNumber != null)
        {
            addressModel.StreetNumber = addressUpdateModel.StreetNumber;
            changeCounter++;
        }

        if (addressUpdateModel.Street != null)
        {
            addressModel.Street = addressUpdateModel.Street;
            changeCounter++;
        }

        if (addressUpdateModel.Apartment != null)
        {
            addressModel.Apartment = addressUpdateModel.Apartment;
            changeCounter++;
        }

        if (addressUpdateModel.AdditionalInfo != null)
        {
            addressModel.AdditionalInfo = addressUpdateModel.AdditionalInfo;
            changeCounter++;
        }

        if (addressUpdateModel.City != null)
        {
            addressModel.City = addressUpdateModel.City;
            changeCounter++;
        }

        if (addressUpdateModel.Province != null)
        {
            addressModel.Province = addressUpdateModel.Province;
            changeCounter++;
        }

        if (addressUpdateModel.Country != null)
        {
            addressModel.Country = addressUpdateModel.Country;
            changeCounter++;
        }

        if (addressUpdateModel.PostalCode != null)
        {
            addressModel.PostalCode = addressUpdateModel.PostalCode;
            changeCounter++;
        }

        if (addressUpdateModel.IsDefault != null)
        {
            addressModel.IsDefault = addressUpdateModel.IsDefault;
            changeCounter++;
        }

        // validate received data
        if (changeCounter == 0) return BadRequest("No new data is provided.");

        // update record in the DB
        var updated = await _addressService.UpdateAddressAsync(addressModel);
        if (!updated) return BadRequest("Could not update user profile.");

        // fetch updated user profile form the DB
        var updatedAddress = await _addressService.GetAddressByIdAsync(id);

        return Ok(updatedAddress);
    }
}