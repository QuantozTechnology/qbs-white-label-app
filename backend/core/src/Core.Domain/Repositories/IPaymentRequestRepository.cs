using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Repositories
{
    public interface IPaymentRequestRepository : IRepository<PaymentRequest>
    {
        public Task<PaymentRequest> GetByCodeForCustomerAsync(string customerCode, string code, CancellationToken cancellationToken = default);

        public Task<PaymentRequest> GetByCodeAsync(string code, CancellationToken cancellationToken = default);

        public Task<PaymentRequest> GetByCodeForMerchantAsync(string code, CancellationToken cancellationToken = default);

        public Task<Paged<PaymentRequest>> GetAllForCustomerAsync(string customerCode, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
    }
}
