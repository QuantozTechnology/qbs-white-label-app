// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.OfferAggregate;
using Core.Domain.Primitives.Offer;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.OfferCommands
{
    public class BaseCreateOfferRequestCommand : IRequest<Offer>
    {
        public required OfferAction OfferAction { get; set; }

        public required string SourceTokenCode { get; set; }

        public required decimal SourceTokenAmount { get; set; }

        public required string DestinationTokenCode { get; set; }

        public required decimal DestinationTokenAmount { get; set; }

        public required decimal PricePerUnit { get; set; }

        public bool? IsOneOffPayment { get; set; }

        public bool? PayerCanChangeRequestedAmount { get; set; }

        public long? ExpiresOn { get; set; }

        public bool? ShareName { get; set; }

        public string? Memo { get; set; }

        public string? OfferCode { get; set; }

        public IDictionary<string, string>? Params { get; set; }
    }

    public class CreateOfferRequestCommand : BaseCreateOfferRequestCommand
    {
        public required string CustomerCode { get; set; }
    }

    public class CreateOfferRequestCommandHandler : IRequestHandler<CreateOfferRequestCommand, Offer>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IOfferRepository _offerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateOfferRequestCommandHandler(ICustomerRepository customerRepository,
            IAccountRepository accountRepository,
            IOfferRepository offerRepository,
            IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _accountRepository = accountRepository;
            _offerRepository = offerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Offer> Handle(CreateOfferRequestCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var account = await _accountRepository.GetByCustomerCodeAsync(customer.CustomerCode, cancellationToken);

            var properties = new OfferProperties
            {
                CustomerCode = customer.CustomerCode,
                PublicKey = account.PublicKey,
                SourceTokenCode = request.SourceTokenCode,
                SourceTokenAmount = request.SourceTokenAmount,
                DestinationTokenCode = request.DestinationTokenCode,
                DestinationTokenAmount = request.DestinationTokenAmount,
                OfferAction = request.OfferAction,
                PricePerUnit = request.PricePerUnit,
                Options = new OfferOptions()
                {
                    Memo = request.Memo,
                }
            };

            // buy offer, set destinationTokenRemainingAmount to destinationTokenAmount, sourceTokenRemainingAmount = null
            if (request.OfferAction == OfferAction.Buy)
            {
                properties.DestinationTokenRemainingAmount = request.DestinationTokenAmount;
                properties.SourceTokenRemainingAmount = null;
            }
            // sell offer, set sourceTokenRemainingAmount to sourceTokenAmount, destinationTokenRemainingAmount = null
            else if (request.OfferAction == OfferAction.Sell)
            {
                properties.SourceTokenRemainingAmount = request.SourceTokenAmount;
                properties.DestinationTokenRemainingAmount = null;
            }

            if (request.ExpiresOn.HasValue)
            {
                properties.Options.ExpiresOn = DateTimeProvider.FromUnixTimeInMilliseconds(request.ExpiresOn.Value);
            }

            if (request.ShareName == true)
            {
                properties.Options.Name = customer.GetName();
            }

            if (request.IsOneOffPayment.HasValue)
            {
                properties.Options.IsOneOffPayment = request.IsOneOffPayment.Value;
            }

            if (request.PayerCanChangeRequestedAmount.HasValue)
            {
                properties.Options.PayerCanChangeRequestedAmount = request.PayerCanChangeRequestedAmount.Value;
            }

            if (request.Params != null && request.Params.Any())
            {
                properties.Options.Params = request.Params
                    .Select(kv => new OfferParams(kv.Key, kv.Value))
                    .ToList();
            }

            var offerRequest = Offer.New(properties);

            _offerRepository.Add(offerRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return offerRequest;
        }
    }
}