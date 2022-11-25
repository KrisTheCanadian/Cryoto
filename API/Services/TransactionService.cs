using API.Models.Transactions;
using API.Repository.Interfaces;
using API.Services.Interfaces;

namespace API.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    
    public TransactionService(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }
    
    public async Task<List<TransactionResponseModel>> GetTransactionsBySenderAsync(string senderOId)
    {
        return await _transactionRepository.GetTransactionsBySenderAsync(senderOId);
    }

    public async Task<List<TransactionResponseModel>> GetTransactionsByReceiverAsync(string receiverOId)
    {
        return await _transactionRepository.GetTransactionsByReceiverAsync(receiverOId);
    }

    public async Task<TransactionModel?> GetTransactionByIdAsync(string id)
    {
        return await _transactionRepository.GetTransactionByIdAsync(id);
    }

    public async Task<bool> AddTransactionAsync(TransactionModel transaction)
    {
        return await _transactionRepository.AddTransactionAsync(transaction);
    }

    public async Task<bool> DeleteTransactionAsync(TransactionModel transaction)
    {
        return await _transactionRepository.DeleteTransactionAsync(transaction);
    }

    public async Task<bool> UpdateTransactionAsync(TransactionModel transaction)
    {
        return await _transactionRepository.UpdateTransactionAsync(transaction);
    }
}