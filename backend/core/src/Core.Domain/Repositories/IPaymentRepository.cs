using Core.Domain.Entities.TransactionAggregate;

namespace Core.Domain.Repositories
{
    public interface IPaymentRepository : IRepository<Payment>
    {
        public Task<Payment> GetByTransactionCodeAsync(string transactionCode, CancellationToken cancellationToken = default);

        public Task<bool> HasTransactionAsync(string transactionCode, CancellationToken cancellationToken = default);
    }
}
