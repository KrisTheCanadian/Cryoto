using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models.Transactions;
using API.Repository.Interfaces;
using API.Services;
using FakeItEasy;
using FluentAssertions;
using Xunit;

namespace API.Tests.ServicesTests;

public class TransactionServiceTests
{
    private readonly TransactionService _controller;
    private readonly ITransactionRepository _transactionRepository;

    public TransactionServiceTests()
    {
        _transactionRepository = A.Fake<ITransactionRepository>();
        _controller = new TransactionService(_transactionRepository);
    }

    [Fact]
    public async Task TransactionService_GetTransactionsBySenderAsync_ReturnsTransactionResponseModelList()
    {
        //Arrange
        var transactionResponseModelList = GetTransactionResponseModelList();
        A.CallTo(() => _transactionRepository.GetTransactionsBySenderAsync(A<string>._))
            .Returns(transactionResponseModelList);


        //Act
        var actionResult = await _controller.GetTransactionsBySenderAsync("senderOId");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<TransactionResponseModel>));
    }

    [Fact]
    public async Task TransactionService_GetTransactionsByReceiverAsync_ReturnsTransactionResponseModelList()
    {
        //Arrange
        var transactionResponseModelList = GetTransactionResponseModelList();
        A.CallTo(() => _transactionRepository.GetTransactionsByReceiverAsync(A<string>._))
            .Returns(transactionResponseModelList);


        //Act
        var actionResult = await _controller.GetTransactionsByReceiverAsync("receiverOId");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(List<TransactionResponseModel>));
    }

    [Fact]
    public async Task TransactionService_GetTransactionByIdAsync_ReturnsTransactionModel()
    {
        //Arrange
        var transactionModel = GetTransactionModel();
        A.CallTo(() => _transactionRepository.GetTransactionByIdAsync(A<string>._))!.Returns(transactionModel);


        //Act
        var actionResult = await _controller.GetTransactionByIdAsync("id");

        //Assert
        actionResult.Should().NotBeNull();
        actionResult.Should().BeOfType(typeof(TransactionModel));
    }

    [Fact]
    public async Task TransactionService_AddTransactionAsync_ReturnsTrue()
    {
        //Arrange
        var transactionModel = GetTransactionModel();
        A.CallTo(() => _transactionRepository.AddTransactionAsync(A<TransactionModel>._)).Returns(true);


        //Act
        var actionResult = await _controller.AddTransactionAsync(transactionModel.Result);

        //Assert
        actionResult.Should().BeTrue();
    }

    [Fact]
    public async Task TransactionService_DeleteTransactionAsync_ReturnsTrue()
    {
        //Arrange
        var transactionModel = GetTransactionModel();
        A.CallTo(() => _transactionRepository.DeleteTransactionAsync(A<TransactionModel>._)).Returns(true);


        //Act
        var actionResult = await _controller.DeleteTransactionAsync(transactionModel.Result);

        //Assert
        actionResult.Should().BeTrue();
    }

    [Fact]
    public async Task TransactionService_UpdateTransactionAsync_ReturnsTrue()
    {
        //Arrange
        var transactionModel = GetTransactionModel();
        A.CallTo(() => _transactionRepository.UpdateTransactionAsync(A<TransactionModel>._)).Returns(true);


        //Act
        var actionResult = await _controller.UpdateTransactionAsync(transactionModel.Result);

        //Assert
        actionResult.Should().BeTrue();
    }

    private static Task<List<TransactionResponseModel>> GetTransactionResponseModelList()
    {
        var timestamp = DateTimeOffset.Now;
        var transactionResponseModelList = new List<TransactionResponseModel>
        {
            new("id1", "oid1", "walletType1", 10, "description1", timestamp),
            new("id2", "oid2", "walletType2", 20, "description2", timestamp)
        };
        return Task.FromResult(transactionResponseModelList);
    }

    private static Task<TransactionModel> GetTransactionModel()
    {
        var timestamp = DateTimeOffset.Now;
        var transactionModel = new TransactionModel("receiverOId", "receiverWalletType", "senderOId",
            "senderWalletType", 10, "type", timestamp);

        return Task.FromResult(transactionModel);
    }
}