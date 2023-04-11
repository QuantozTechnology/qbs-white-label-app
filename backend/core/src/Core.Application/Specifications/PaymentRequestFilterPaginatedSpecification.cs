// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.PaymentRequestAggregate;

namespace Core.Application.Specifications
{
    public class PaymentRequestFilterPaginatedSpecification : OrderedPagedSpecification<PaymentRequest>
    {
        public PaymentRequestFilterPaginatedSpecification(
            string customerCode,
            PaymentRequestStatus? status,
            int page,
            int pageSize)
        : base(pr => pr.CustomerCode == customerCode && (!status.HasValue || pr.Status == status.Value),
              pr => pr.CreatedOn,
              page,
              pageSize)
        {
            AddInclude(pr => pr.Payments);
        }
    }
}
