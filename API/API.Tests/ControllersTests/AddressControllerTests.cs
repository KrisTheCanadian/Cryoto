using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.Models.Address;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.ControllersTests;

public class AddressControllerTests
{
    private readonly IAddressService _addressService;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly AddressController _controller;

    public AddressControllerTests()
    {
        _addressService = A.Fake<IAddressService>();
        _contextAccessor = A.Fake<IHttpContextAccessor>();
        _controller = new AddressController(_addressService, _contextAccessor);
    }

    [Fact]
    public async void AddressController_GetDefaultAddressOrCreate_ReturnsOK()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _addressService.GetDefaultAddressByOIdAsync(A<string>._))
            .Returns(Task.FromResult<AddressModel?>(addressModel.Result));

        //Act
        var actionResult = await _controller.GetDefaultAddressOrCreate();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(addressModel.Result.OId);
        objectResultValue?.StreetNumber.Should().Be(addressModel.Result.StreetNumber);
        objectResultValue?.Street.Should().Be(addressModel.Result.Street);
        objectResultValue?.City.Should().Be(addressModel.Result.City);
        objectResultValue?.Province.Should().Be(addressModel.Result.Province);
        objectResultValue?.Country.Should().Be(addressModel.Result.Country);
        objectResultValue?.PostalCode.Should().Be(addressModel.Result.PostalCode);
    }

    [Fact]
    public async void AddressController_GetDefaultAddressOrCreate_ReturnsOK2()
    {
        //Arrange
        var addressModel = GetAddressModel();
        AddressModel? nullAddressModel = null;
        A.CallTo(() => _addressService.GetDefaultAddressByOIdAsync(A<string>._))
            .ReturnsNextFromSequence(new[]
            {
                Task.FromResult<AddressModel?>(nullAddressModel), Task.FromResult<AddressModel?>(addressModel.Result)
            });
        A.CallTo(() => _addressService.CreateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));

        //Act
        var actionResult = await _controller.GetDefaultAddressOrCreate();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(addressModel.Result.OId);
        objectResultValue?.StreetNumber.Should().Be(addressModel.Result.StreetNumber);
        objectResultValue?.Street.Should().Be(addressModel.Result.Street);
        objectResultValue?.City.Should().Be(addressModel.Result.City);
        objectResultValue?.Province.Should().Be(addressModel.Result.Province);
        objectResultValue?.Country.Should().Be(addressModel.Result.Country);
        objectResultValue?.PostalCode.Should().Be(addressModel.Result.PostalCode);
    }

    [Fact]
    public async void AddressController_GetDefaultAddressOrCreate_ReturnsProblem()
    {
        //Arrange
        AddressModel? nullAddressModel = null;
        A.CallTo(() => _addressService.GetDefaultAddressByOIdAsync(A<string>._))
            .Returns(Task.FromResult(nullAddressModel));
        A.CallTo(() => _addressService.CreateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(false));

        //Act
        var actionResult = await _controller.GetDefaultAddressOrCreate();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().NotBeOfType(typeof(OkObjectResult));
    }
    
    [Fact]
    public async void AddressController_GetDefaultAddress_ReturnsOK()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _addressService.GetDefaultAddressByOIdAsync(A<string>._))
            .Returns(Task.FromResult<AddressModel?>(addressModel.Result));

        //Act
        var actionResult = await _controller.GetDefaultAddress();
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(addressModel.Result.OId);
        objectResultValue?.StreetNumber.Should().Be(addressModel.Result.StreetNumber);
        objectResultValue?.Street.Should().Be(addressModel.Result.Street);
        objectResultValue?.City.Should().Be(addressModel.Result.City);
        objectResultValue?.Province.Should().Be(addressModel.Result.Province);
        objectResultValue?.Country.Should().Be(addressModel.Result.Country);
        objectResultValue?.PostalCode.Should().Be(addressModel.Result.PostalCode);
    }

    [Fact]
    public async void AddressController_Add_ReturnsOK()
    {
        //Arrange
        var addressModel = GetAddressModel();
        AddressCreateModel addressCreateModel = new AddressCreateModel("id", "sn", "st", "c", "p", "c", "pc");
        A.CallTo(() => _addressService.CreateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .Returns(Task.FromResult<AddressModel?>(addressModel.Result));

        //Act
        var actionResult = await _controller.Add(addressCreateModel);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(addressModel.Result.OId);
        objectResultValue?.StreetNumber.Should().Be(addressModel.Result.StreetNumber);
        objectResultValue?.Street.Should().Be(addressModel.Result.Street);
        objectResultValue?.City.Should().Be(addressModel.Result.City);
        objectResultValue?.Province.Should().Be(addressModel.Result.Province);
        objectResultValue?.Country.Should().Be(addressModel.Result.Country);
        objectResultValue?.PostalCode.Should().Be(addressModel.Result.PostalCode);
    }

    [Fact]
    public async void AddressController_Add_ReturnsBadRequest()
    {
        //Arrange
        AddressCreateModel addressCreateModel = new AddressCreateModel("id", "sn", "st", "c", "p", "c", "pc");
        A.CallTo(() => _addressService.CreateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(false));

        //Act
        var actionResult = await _controller.Add(addressCreateModel);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }

    [Fact]
    public async void AddressController_Delete_ReturnsOK()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _addressService.DeleteAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .Returns(Task.FromResult<AddressModel?>(addressModel.Result));

        //Act
        var actionResult = await _controller.Delete(0);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(addressModel.Result.OId);
        objectResultValue?.StreetNumber.Should().Be(addressModel.Result.StreetNumber);
        objectResultValue?.Street.Should().Be(addressModel.Result.Street);
        objectResultValue?.City.Should().Be(addressModel.Result.City);
        objectResultValue?.Province.Should().Be(addressModel.Result.Province);
        objectResultValue?.Country.Should().Be(addressModel.Result.Country);
        objectResultValue?.PostalCode.Should().Be(addressModel.Result.PostalCode);
    }

    [Fact]
    public async void AddressController_Delete_ReturnsBadRequest()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .Returns(Task.FromResult<AddressModel?>(null));

        //Act
        var actionResult = await _controller.Delete(0);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }
    
    [Fact]
    public async void AddressController_Delete_ReturnsBadRequest2()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _addressService.DeleteAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(false));
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .Returns(Task.FromResult<AddressModel?>(addressModel.Result));

        //Act
        var actionResult = await _controller.Delete(0);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }
    
    [Fact]
    public async void AddressController_Update_ReturnsOK()
    {
        //Arrange
        var addressModel = GetAddressModel();
        AddressModel? oldAddressModel = addressModel.Result;
        AddressUpdateModel addressUpdateModel = new AddressUpdateModel("street number 3", "street 3", "apartment 3",
            "additional information 3", "city 3", "country 3", "province 3", "postal code 3", true);
        AddressModel updateAddressModel = new AddressModel(oldAddressModel.OId, addressUpdateModel.StreetNumber ?? "",
            addressUpdateModel.Street ?? "", addressUpdateModel.City ?? "", addressUpdateModel.Province ?? "", addressUpdateModel.Country ?? "",
            addressUpdateModel.PostalCode ?? "", addressUpdateModel.Apartment, addressUpdateModel.AdditionalInfo,
            addressUpdateModel.IsDefault);
        A.CallTo(() => _addressService.UpdateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .ReturnsNextFromSequence(new[]{Task.FromResult<AddressModel?>(oldAddressModel), Task.FromResult<AddressModel?>(updateAddressModel)});

        //Act
        var actionResult = await _controller.Update(0, addressUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as AddressModel;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        objectResultValue?.OId.Should().Be(updateAddressModel.OId);
        objectResultValue?.StreetNumber.Should().Be(updateAddressModel.StreetNumber);
        objectResultValue?.Street.Should().Be(updateAddressModel.Street);
        objectResultValue?.City.Should().Be(updateAddressModel.City);
        objectResultValue?.Province.Should().Be(updateAddressModel.Province);
        objectResultValue?.Country.Should().Be(updateAddressModel.Country);
        objectResultValue?.PostalCode.Should().Be(updateAddressModel.PostalCode);
    }
    
    [Fact]
    public async void AddressController_Update_ReturnsBadRequest()
    {
        //Arrange
        var addressUpdateModel = new AddressUpdateModel("street number 3", "street 3", "apartment 3",
            "additional information 3", "city 3", "country 3", "province 3", "postal code 3", true);
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .Returns(Task.FromResult<AddressModel?>(null));

        //Act
        var actionResult = await _controller.Update(0, addressUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }
    
    [Fact]
    public async void AddressController_Update_ReturnsBadRequest2()
    {
        //Arrange
        var addressModel = GetAddressModel();
        AddressModel? oldAddressModel = addressModel.Result;
        AddressUpdateModel addressUpdateModel = new AddressUpdateModel(null,null,null,null,null,null,null,null,null);
        A.CallTo(() => _addressService.UpdateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .Returns(Task.FromResult<AddressModel?>(oldAddressModel));

        //Act
        var actionResult = await _controller.Update(0, addressUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }
    
    
    [Fact]
    public async void AddressController_Update_ReturnsBadRequest3()
    {
        //Arrange
        var addressModel = GetAddressModel();
        AddressModel? oldAddressModel = addressModel.Result;
        AddressUpdateModel addressUpdateModel = new AddressUpdateModel("street number 3", "street 3", "apartment 3",
            "additional information 3", "city 3", "country 3", "province 3", "postal code 3", true);
        A.CallTo(() => _addressService.UpdateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(false));
        A.CallTo(() => _addressService.GetAddressByIdAsync(A<long>._))
            .Returns(Task.FromResult<AddressModel?>(oldAddressModel));

        //Act
        var actionResult = await _controller.Update(0, addressUpdateModel);
        var objectResult = actionResult.Result as ObjectResult;

        //Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(BadRequestObjectResult));
    }
    
    private static Task<List<AddressModel>> GetAddressModelList()
    {
        var addressModelList = new List<AddressModel>
        {
            new("oid1", "1", "street1", "city1", "provine1", "country1", "pc1"),
            new("oid2", "2", "street2", "city2", "provine2", "country2", "pc2"),
        };
        return Task.FromResult(addressModelList);
    }

    private static Task<AddressModel> GetAddressModel()
    {
        var addressModel = new AddressModel("oid1", "1", "street1", "city1", "provine1", "country1", "pc1");
        return Task.FromResult(addressModel);
    }
}