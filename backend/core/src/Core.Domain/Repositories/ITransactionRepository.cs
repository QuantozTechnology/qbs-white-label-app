using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Repositories
{
    public interface ITransactionRepository
    {
        public Task<string> CreatePaymentAsync(Payment payment, string? ip = null, CancellationToken cancellationToken = default);

        public Task CreateWithdrawAsync(Withdraw withdraw, string? ip = null, CancellationToken cancellationToken = default);

        public Task<Paged<Transaction>> GetAsync(string publicKey, int page, int pageSize, CancellationToken cancellationToken = default);

        public Task<WithdrawFees> GetWithdrawFeesAsync(Withdraw withdraw, CancellationToken cancellationToken = default);
    }
}
