using Core.Domain.Entities.AccountAggregate;

namespace Core.Domain.Repositories
{
    public interface IAccountRepository
    {
        public Task CreateAsync(Account account, CancellationToken cancellationToken = default);

        public Task<Account> GetByCustomerCodeAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task<Account> GetByAccountCodeAsync(string accountCode, CancellationToken cancellationToken = default);

        public Task<bool> HasAccountAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task<IEnumerable<AccountBalance>> GetBalancesAsync(string publicKey, CancellationToken cancellationToken = default);
    }
}
