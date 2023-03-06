using Core.Domain.Entities.CustomerAggregate;

namespace Core.Domain.Repositories
{
    public interface ICustomerRepository
    {
        public Task CreateAsync(Customer customer, string? ip = null, CancellationToken cancellationToken = default);

        public Task<Customer> GetAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task<IEnumerable<CustomerLimit>> GetLimitsAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task UpdateAsync(Customer customer, CancellationToken cancellationToken = default);
    }
}
