using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models.Address;
using API.Repository.Interfaces;
using API.Services;
using FakeItEasy;
using FluentAssertions;
using Xunit;

namespace API.Tests.ServicesTests;

public class AddressServicesTests
{
    private readonly IAddressRepository _context;
    private readonly AddressService _controller;

    public AddressServicesTests()
    {
        _context = A.Fake<IAddressRepository>();
        _controller = new AddressService(_context);
    }

    [Fact]
    public async Task AddressService_CreateAddressAsync_ReturnsBool()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _context.CreateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));

        //Act
        var actionResult = await _controller.CreateAddressAsync(addressModel.Result);

        //Assert
        actionResult.Should().BeTrue();
    }

    [Fact]
    public async Task AddressService_DeleteAddressAsync_ReturnsBool()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _context.DeleteAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));

        //Act
        var actionResult = await _controller.DeleteAddressAsync(addressModel.Result);

        //Assert
        actionResult.Should().BeTrue();
    }

    [Fact]
    public async Task AddressService_GetDefaultAddressByOIdAsync_ReturnsAddressModel()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _context.GetDefaultAddressByOIdAsync(A<string>._)).Returns(addressModel.Result);

        //Act
        var actionResult = await _controller.GetDefaultAddressByOIdAsync("oid");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(AddressModel));
        actionResult?.StreetNumber.Should().Be(addressModel.Result.StreetNumber);
        actionResult?.Street.Should().Be(addressModel.Result.Street);
        actionResult?.City.Should().Be(addressModel.Result.City);
        actionResult?.Province.Should().Be(addressModel.Result.Province);
        actionResult?.Country.Should().Be(addressModel.Result.Country);
        actionResult?.PostalCode.Should().Be(addressModel.Result.PostalCode);
    }

    [Fact]
    public async Task AddressService_GetAllAddressesAsync_ReturnsAddressModelList()
    {
        //Arrange
        var addressModelList = GetAddressModelList();
        A.CallTo(() => _context.GetAllAddressesAsync()).Returns(addressModelList);

        //Act
        var actionResult = await _controller.GetAllAddressesAsync();

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<AddressModel>));
        actionResult[0].StreetNumber.Should().Be(addressModelList.Result[0].StreetNumber);
        actionResult[0].Street.Should().Be(addressModelList.Result[0].Street);
        actionResult[0].City.Should().Be(addressModelList.Result[0].City);
        actionResult[0].Province.Should().Be(addressModelList.Result[0].Province);
        actionResult[0].Country.Should().Be(addressModelList.Result[0].Country);
        actionResult[0].PostalCode.Should().Be(addressModelList.Result[0].PostalCode);
    }

    [Fact]
    public async Task AddressService_GetAddressByIdAsync_ReturnsAddressModel()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _context.GetAddressByIdAsync(A<long>._)).Returns(addressModel.Result);

        //Act
        var actionResult = await _controller.GetAddressByIdAsync(0);

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(AddressModel));
        actionResult?.StreetNumber.Should().Be(addressModel.Result.StreetNumber);
        actionResult?.Street.Should().Be(addressModel.Result.Street);
        actionResult?.City.Should().Be(addressModel.Result.City);
        actionResult?.Province.Should().Be(addressModel.Result.Province);
        actionResult?.Country.Should().Be(addressModel.Result.Country);
        actionResult?.PostalCode.Should().Be(addressModel.Result.PostalCode);
    }

    [Fact]
    public async Task AddressService_GetAllAddressesByOIdAsync_ReturnsAddressModelList()
    {
        //Arrange
        var addressModelList = GetAddressModelList();
        A.CallTo(() => _context.GetAllAddressesByOIdAsync(A<string>._)).Returns(addressModelList);

        //Act
        var actionResult = await _controller.GetAllAddressesByOIdAsync("oid");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<AddressModel>));
        actionResult[0].StreetNumber.Should().Be(addressModelList.Result[0].StreetNumber);
        actionResult[0].Street.Should().Be(addressModelList.Result[0].Street);
        actionResult[0].City.Should().Be(addressModelList.Result[0].City);
        actionResult[0].Province.Should().Be(addressModelList.Result[0].Province);
        actionResult[0].Country.Should().Be(addressModelList.Result[0].Country);
        actionResult[0].PostalCode.Should().Be(addressModelList.Result[0].PostalCode);
    }

    [Fact]
    public async Task AddressService_UpdateAddressAsync_ReturnsBool()
    {
        //Arrange
        var addressModel = GetAddressModel();
        A.CallTo(() => _context.UpdateAddressAsync(A<AddressModel>._)).Returns(Task.FromResult(true));

        //Act
        var actionResult = await _controller.UpdateAddressAsync(addressModel.Result);

        //Assert
        actionResult.Should().BeTrue();
    }

    private static Task<List<AddressModel>> GetAddressModelList()
    {
        var addressModelList = new List<AddressModel>
        {
            new("oid1", "1", "street1", "city1", "provine1", "country1", "pc1"),
            new("oid2", "2", "street2", "city2", "provine2", "country2", "pc2")
        };
        return Task.FromResult(addressModelList);
    }

    private static Task<AddressModel> GetAddressModel()
    {
        var addressModel = new AddressModel("oid1", "1", "street1", "city1", "provine1", "country1", "pc1");
        return Task.FromResult(addressModel);
    }
}