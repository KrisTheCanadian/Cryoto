using API.Models.Transactions;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TransactionResponseModel>>> GetTransactionsBySenderOId(string senderOId)
    {
        var senderList = await _transactionService.GetTransactionsBySenderAsync(senderOId);
        return Ok(senderList);
    }

    [HttpGet]
    public async Task<ActionResult<List<TransactionResponseModel>>> GetTransactionsByReceiverOId(string receiverOId)
    {
        var receiverList = await _transactionService.GetTransactionsByReceiverAsync(receiverOId);
        return Ok(receiverList);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionModel>> AddTransaction(TransactionModel transaction)
    {
        var created = await _transactionService.AddTransactionAsync(transaction);
        if (!created)
            return BadRequest("Could not create the transaction");
        var createdTransaction = await _transactionService.GetTransactionByIdAsync(transaction.Id);
        return Ok(createdTransaction);
    }
}