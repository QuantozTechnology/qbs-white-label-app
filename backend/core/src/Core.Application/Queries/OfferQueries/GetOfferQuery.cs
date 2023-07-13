// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.OfferAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.PaymentRequestQueries
{
    public class GetOfferQuery : IRequest<Offer>
    {
        public string OfferCode { get; set; }

        public GetOfferQuery(string offerCode)
        {
            OfferCode = offerCode;
        }
    }

    public class GetOfferQueryHandler : IRequestHandler<GetOfferQuery, Offer>
    {
        private readonly IOfferRepository _offerRepository;

        public GetOfferQueryHandler(IOfferRepository offerRepository)
        {
            _offerRepository = offerRepository;
        }

        public Task<Offer> Handle(GetOfferQuery request, CancellationToken cancellationToken)
        {
            return _offerRepository.GetByOfferCodeAsync(request.OfferCode, cancellationToken);
        }
    }
}
