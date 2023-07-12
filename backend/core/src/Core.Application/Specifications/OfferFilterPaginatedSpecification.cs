// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.OfferAggregate;

namespace Core.Application.Specifications
{
    public class OfferFilterPaginatedSpecification : OrderedPagedSpecification<Offer>
    {
        public OfferFilterPaginatedSpecification(
            string customerCode,
            OfferStatus? status,
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
