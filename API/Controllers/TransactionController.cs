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

    [HttpGet]
    public async Task<ActionResult<TransactionModel>> GetTransactionById(string id)
    {
        var transaction = await _transactionService.GetTransactionByIdAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }
        return Ok(transaction);
    }
    
    
    [HttpPost]
    public async Task<ActionResult<List<TransactionModel>>> AddTransaction(TransactionModel transaction)
    {
        var created = await _transactionService.AddTransactionAsync(transaction);
        if (!created)
            return BadRequest("Could not create the transaction");
        var createdTransaction = await _transactionService.GetTransactionByIdAsync(transaction.Id);
        return Ok(createdTransaction);
    }
    
    [HttpPut]
    public async Task<ActionResult<List<TransactionModel>>> UpdateTransaction(TransactionModel transaction)
    {
        var exists = await _transactionService.GetTransactionByIdAsync(transaction.Id);
        if (exists == null) return Conflict("Cannot update the transaction because it does not exist.");
        
        var updated = await _transactionService.UpdateTransactionAsync(transaction);
        if (!updated) return BadRequest("Could not update the transaction");
        var updatedTransaction = await _transactionService.GetTransactionByIdAsync(transaction.Id);
        return Ok(updatedTransaction);
    }
    
    [HttpDelete]
    public async Task<ActionResult<List<TransactionModel>>> DeleteTransaction(TransactionModel transaction)
    {
        var exists = await _transactionService.GetTransactionByIdAsync(transaction.Id);
        if (exists == null) return Conflict("Cannot delete the transaction because it does not exist.");
        var deletedTransaction = await _transactionService.DeleteTransactionAsync(transaction);
        if (!deletedTransaction)
            return BadRequest("Could not delete the transaction");
        return Ok($"Successfully deleted transaction {transaction.Id}");
    }
    
}