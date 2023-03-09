﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
