using Core.Domain;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Abstractions
{
    public interface IComplianceService
    {
        public IDictionary<TierType, string> GetTrustlevelsForMerchantCustomer();
        public IDictionary<TierType, string> GetTrustlevelsForPrivateCustomer();

        public Task<ComplianceCheckResponse> CheckAsync(Customer customer, string ip, CancellationToken cancellationToken = default);
    }
}
