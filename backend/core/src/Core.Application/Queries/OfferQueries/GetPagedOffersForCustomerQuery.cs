// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.Interfaces;
using Core.Application.Specifications;
using Core.Domain;
using Core.Domain.Entities.OfferAggregate;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.OfferQueries
{
    public class GetPagedOffersForCustomerQuery : IRequest<Paged<Offer>>, IPagedQuery
    {
        public string CustomerCode { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public OfferStatus? Status { get; set; }

        public GetPagedOffersForCustomerQuery(string customerCode, string? status, int page, int pageSize)
        {
            CustomerCode = customerCode;
            Page = page;
            PageSize = pageSize;

            if (!string.IsNullOrWhiteSpace(status)
                && Enum.TryParse(status, true, out OfferStatus offerStatus)
                && Enum.IsDefined(typeof(OfferStatus), offerStatus))
            {
                Status = offerStatus;
            }
        }
    }

    public class GetPagedOffersForCustomerQueryHandler : IRequestHandler<GetPagedOffersForCustomerQuery, Paged<Offer>>
    {
        private readonly IOfferRepository _offerRepository;

        public GetPagedOffersForCustomerQueryHandler(IOfferRepository offerRepository)
        {
            _offerRepository = offerRepository;
        }

        public async Task<Paged<Offer>> Handle(GetPagedOffersForCustomerQuery request, CancellationToken cancellationToken)
        {
            var specification = new OfferFilterPaginatedSpecification(request.CustomerCode, request.Status, request.Page, request.PageSize);

            var offers = await _offerRepository.ListAsync(specification, cancellationToken);

            var orderedOffers = offers.OrderByDescending(c => c.CreatedOn)?.ToList();

            return new Paged<Offer>
            {
                Items = orderedOffers ?? new List<Offer>(),
                Page = request.Page,
                PageSize = request.PageSize,
                Total = offers.Count
            };
        }
    }
}
