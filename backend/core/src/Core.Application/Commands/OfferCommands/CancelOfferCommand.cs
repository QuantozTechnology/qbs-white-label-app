// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.OfferCommands
{
    public class CancelOfferCommand : IRequest
    {
        public CancelOfferCommand(string customerCode, string offerCode)
        {
            CustomerCode = customerCode;
            OfferCode = offerCode;
        }

        public string CustomerCode { get; set; }

        public string OfferCode { get; set; }
    }

    public class CancelOfferCommandHandler : IRequestHandler<CancelOfferCommand>
    {
        private readonly IOfferRepository _offerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CancelOfferCommandHandler(
            IOfferRepository offerRepository,
            IUnitOfWork unitOfWork)
        {
            _offerRepository = offerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(CancelOfferCommand request, CancellationToken cancellationToken)
        {
            var offer = await _offerRepository.GetByCodeForCustomerAsync(request.CustomerCode, request.OfferCode, cancellationToken);
            offer.Cancel();
            _offerRepository.Update(offer);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
