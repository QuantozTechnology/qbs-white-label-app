using Web.SDK.ROP;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services.Interfaces
{
    public interface ITransactionService
    {
        public Task<Result<IEnumerable<TransactionResponse>>> GetTransactionsAsync(int page = 1, int pageSize = 10);
    }
}
