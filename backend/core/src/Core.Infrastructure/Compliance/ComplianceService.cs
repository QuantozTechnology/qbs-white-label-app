using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Primitives;
using Core.Infrastructure.Compliance.IPLocator;
using Core.Infrastructure.Compliance.Sanctionlist;

namespace Core.Infrastructure.Compliance
{
    public class ComplianceService : IComplianceService
    {
        private readonly IIPLocator _ipLocator;
        private readonly ISanctionlist _sanctionlist;

        private readonly ComplianceOptions _settings;

        public ComplianceService(IIPLocator ipLocator, ISanctionlist sanctionlist, ComplianceOptions settings)
        {
            _ipLocator = ipLocator;
            _sanctionlist = sanctionlist;
            _settings = settings;
        }

        public async Task<ComplianceCheckResponse> CheckAsync(Customer customer, string ip, CancellationToken cancellationToken = default)
        {
            // country check
            if (IsCountryBlacklisted(customer.GetCountry()))
            {
                return ComplianceCheckResponse.Failed(ComplianceCheckResult.CountryIsBlacklisted, customer.GetCountry());
            }

            // ip check
            var isp = await _ipLocator.GetISP(ip);

            if (isp.Country != null && IsCountryBlacklisted(isp.Country))
            {
                return ComplianceCheckResponse.Failed(ComplianceCheckResult.CountryIsBlacklisted, isp.Country);
            }

            if (isp.IsVPN == true)
            {
                return ComplianceCheckResponse.Failed(ComplianceCheckResult.UsingVPN, ip);
            }

            // sanction list check
            if (customer.IsMerchant)
            {
                var isMerchantSanctioned = await _sanctionlist.IsEnterpriseSanctioned(customer.CustomerCode, customer.GetName());

                if (isMerchantSanctioned)
                {
                    return ComplianceCheckResponse.Failed(ComplianceCheckResult.Sanctioned, customer.GetName());
                }
            }
            else
            {
                var isPersonSanctioned = await _sanctionlist.IsPersonSanctioned(customer.CustomerCode, customer.GetName());

                if (isPersonSanctioned)
                {
                    return ComplianceCheckResponse.Failed(ComplianceCheckResult.Sanctioned, customer.GetName());
                }
            }

            return ComplianceCheckResponse.Passed();
        }

        public IDictionary<TierType, string> GetTrustlevelsForMerchantCustomer()
        {
            return new Dictionary<TierType, string>
            {
                { TierType.Tier1, _settings.MerchantTrustlevels.Tier1 },
                { TierType.Tier2, _settings.MerchantTrustlevels.Tier2 },
                { TierType.Tier3, _settings.MerchantTrustlevels.Tier3 },
            };
        }

        public IDictionary<TierType, string> GetTrustlevelsForPrivateCustomer()
        {
            return new Dictionary<TierType, string>
            {
                { TierType.Tier1, _settings.PrivateTrustlevels.Tier1 },
                { TierType.Tier2, _settings.PrivateTrustlevels.Tier2 },
                { TierType.Tier3, _settings.PrivateTrustlevels.Tier3 },
            };
        }

        private bool IsCountryBlacklisted(string code)
        {
            var blacklisted = false;

            if (!string.IsNullOrWhiteSpace(_settings.BlacklistedCountries))
            {
                blacklisted = _settings.BlacklistedCountries.Split(';').Any(a => a.Equals(code, StringComparison.OrdinalIgnoreCase));
            }

            return blacklisted;
        }
    }
}
