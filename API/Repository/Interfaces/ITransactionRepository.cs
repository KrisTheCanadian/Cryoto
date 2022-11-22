using API.Models.Transactions;

namespace API.Repository.Interfaces;

public interface ITransactionRepository
{
    public Task<List<TransactionResponseModel>> GetTransactionsBySenderAsync(string senderOId);
    public Task<List<TransactionResponseModel>> GetTransactionsByReceiverAsync(string receiverOId);
    public Task<TransactionModel?> GetTransactionByIdAsync(string id);
    public Task<bool> AddTransactionAsync(TransactionModel transaction);
    public Task<bool> DeleteTransactionAsync(TransactionModel transaction);
    public Task<bool> UpdateTransactionAsync(TransactionModel transaction);

}