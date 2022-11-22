using API.Models.Transactions;
using API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class TransactionRepository : ITransactionRepository
{
    
    private IDataContext Context { get; set; }

    public TransactionRepository(IDataContext context)
    {
        Context = context;
    }

    public async Task<List<TransactionResponseModel>> GetTransactionsBySenderAsync(string senderOId)
    {
        return await Context.Transactions.Where(t => t.SenderOId == senderOId)
            .Select(p => new TransactionResponseModel(p.Id, p.SenderOId,p.SenderWalletType, p.TokenAmount*-1, p.Type, p.Timestamp )).AsNoTracking().ToListAsync();
    }

    public async Task<List<TransactionResponseModel>> GetTransactionsByReceiverAsync(string receiverOId)
    {
        return await Context.Transactions.Where(t => t.ReceiverOId == receiverOId)
            .Select(p => new TransactionResponseModel(p.Id, p.ReceiverOId, p.ReceiverWalletType, p.TokenAmount, p.Type, p.Timestamp )).AsNoTracking().ToListAsync();
    }

    public async Task<TransactionModel?> GetTransactionByIdAsync(string id)
    {
        return await Context.Transactions.FirstOrDefaultAsync(x => x.Id.Equals(id));
    }
    
    public async Task<bool> AddTransactionAsync(TransactionModel transaction)
    {
        Context.Transactions.Add(transaction);
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteTransactionAsync(TransactionModel transaction)
    {
        Context.Transactions.Remove(transaction);
        return await Context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateTransactionAsync(TransactionModel transaction)
    {
        Context.Transactions.Update(transaction);
        return await Context.SaveChangesAsync() > 0;
    }
}