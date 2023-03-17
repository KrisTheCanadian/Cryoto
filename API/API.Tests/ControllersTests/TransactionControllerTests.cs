using System;
using System.Collections.Generic;
using API.Controllers;
using API.Models.Transactions;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.ControllersTests;

public class TransactionControllerTests
{
    private readonly ITransactionService _transactionService;
    private readonly TransactionController _controller;

    public TransactionControllerTests()
    {
        _transactionService = A.Fake<ITransactionService>();
        _controller = new TransactionController(_transactionService);
    }
    
    private TransactionModel GetFakeTransaction()
    {
        return new TransactionModel(
            "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "toSpend",
            "6ef89e64-4325-3543-b3fc-2a963f66afa6",
            "toAward",
            10,
            "Recognition",
            DateTimeOffset.Now
        );
    }
    
    private List<TransactionResponseModel> GetFakeSenderTransactions()
    {
        var transaction1 = new TransactionResponseModel(
            "unique-id-1",
            "3fa85f64-5717-4562-b3fc-2c963f66afa6",
             "toAward",
            -5,
            "Recognition",
            DateTimeOffset.Now
        );
        var transaction2 = new TransactionResponseModel(
            "unique-id-2",
            "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "toAward",
            -3,
            "Recognition",
            DateTimeOffset.Now
        );
        return new List<TransactionResponseModel>
        {
            transaction1,
            transaction2
        };
    }
    
    private List<TransactionResponseModel> GetFakeReceiverTransactions()
    {
        var transaction1 = new TransactionResponseModel(
            "unique-id-1",
            "6ef89e64-4325-3543-b3fc-2a963f66afa6",
            "toSpend",
            5,
            "Recognition",
            DateTimeOffset.Now
        );
        var transaction2 = new TransactionResponseModel(
            "unique-id-2",
            "6ef89e64-4325-3543-b3fc-2a963f66afa6",
            "toSpend",
            3,
            "Recognition",
            DateTimeOffset.Now
        );
        return new List<TransactionResponseModel>
        {
            transaction1,
            transaction2
        };
    }

    [Fact]
    public async void TransactionController_GetTransactionsBySenderOId_ReturnsOK()
    {
        // Arrange
        var transactions = GetFakeSenderTransactions();
        var senderId = transactions[0].UserId;
        A.CallTo(() => _transactionService.GetTransactionsBySenderAsync(senderId)).Returns(transactions);
        
        // Act
        var actionResult = await _controller.GetTransactionsBySenderOId(senderId);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as List<TransactionResponseModel>;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        Assert.Equal(transactions, objectResultValue);
    }
    
    [Fact]
    public async void TransactionController_GetTransactionsByReceiverOId_ReturnsOK()
    {
        // Arrange
        var transactions = GetFakeReceiverTransactions();
        var receiverId = transactions[0].UserId;
        A.CallTo(() => _transactionService.GetTransactionsByReceiverAsync(receiverId)).Returns(transactions);
        
        // Act
        var actionResult = await _controller.GetTransactionsByReceiverOId(receiverId);
        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as List<TransactionResponseModel>;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        Assert.Equal(transactions, objectResultValue);
    }

    [Fact]
    public async void TransactionController_AddTransaction_ReturnsOK()
    {
        // Arrange
        var transaction = GetFakeTransaction();

        A.CallTo(() => _transactionService.AddTransactionAsync(A<TransactionModel>.Ignored)).Returns(true);
        A.CallTo(() => _transactionService.GetTransactionByIdAsync(A<string>._)).Returns(transaction);

        // Act
        var actionResult = await _controller.AddTransaction(transaction);

        var objectResult = actionResult.Result as ObjectResult;
        var objectResultValue = objectResult?.Value as TransactionModel;

        // Assert
        objectResult.Should().NotBeNull();
        objectResult.Should().BeOfType(typeof(OkObjectResult));
        
        Assert.Equal(transaction.Id, objectResultValue?.Id);
        Assert.Equal(transaction.Type, objectResultValue?.Type);
        Assert.Equal(transaction.TokenAmount, objectResultValue?.TokenAmount);
        Assert.Equal(transaction.ReceiverOId, objectResultValue?.ReceiverOId);
        Assert.Equal(transaction.ReceiverWalletType, objectResultValue?.ReceiverWalletType);
    }
}