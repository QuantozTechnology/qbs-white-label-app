// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Entities.SettingsAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries
{
    public class GetTrustlevelsQuery : IRequest<IDictionary<TierType, TrustLevel>>
    {
        public string CustomerCode { get; set; }

        public GetTrustlevelsQuery(string customerCode)
        {
            CustomerCode = customerCode;
        }
    }

    public class GetTrustlevelQueryHandler : IRequestHandler<GetTrustlevelsQuery, IDictionary<TierType, TrustLevel>>
    {
        private readonly ISettingsRepository _settingRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IComplianceService _complianceService;

        public GetTrustlevelQueryHandler(ISettingsRepository repository,
            ICustomerRepository customerRepository,
            IComplianceService complianceService)
        {
            _settingRepository = repository;
            _customerRepository = customerRepository;
            _complianceService = complianceService;
        }

        public async Task<IDictionary<TierType, TrustLevel>> Handle(GetTrustlevelsQuery request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode);

            var tierToTrustlevelMap = customer.IsMerchant switch
            {
                true => _complianceService.GetTrustlevelsForMerchantCustomer(),
                false => _complianceService.GetTrustlevelsForPrivateCustomer()
            };

            var trustlevels = new Dictionary<TierType, TrustLevel>();

            foreach (var kv in tierToTrustlevelMap)
            {
                var trustlevel = await _settingRepository.GetTrustlevelAsync(kv.Value);
                trustlevels.Add(kv.Key, trustlevel);
            }

            return trustlevels;
        }
    }
}
