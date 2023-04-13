// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Primitives.PaymentRequest;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.PaymentRequestCommands
{
    public class BaseCreatePaymentRequestCommand : IRequest<PaymentRequest>
    {
        public required string TokenCode { get; set; }

        public required decimal Amount { get; set; }

        public bool? IsOneOffPayment { get; set; }

        public bool? PayerCanChangeRequestedAmount { get; set; }

        public long? ExpiresOn { get; set; }

        public bool? ShareName { get; set; }

        public string? Memo { get; set; }

        public IDictionary<string, string>? Params { get; set; }
    }

    public class CreatePaymentRequestCommand : BaseCreatePaymentRequestCommand
    {
        public required string CustomerCode { get; set; }
    }

    public class CreatePaymentRequestCommandHandler : IRequestHandler<CreatePaymentRequestCommand, PaymentRequest>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IPaymentRequestRepository _paymentRequestRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreatePaymentRequestCommandHandler(ICustomerRepository customerRepository,
            IAccountRepository accountRepository,
            IPaymentRequestRepository paymentRequestRepository,
            IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _accountRepository = accountRepository;
            _paymentRequestRepository = paymentRequestRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<PaymentRequest> Handle(CreatePaymentRequestCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var account = await _accountRepository.GetByCustomerCodeAsync(customer.CustomerCode, cancellationToken);

            var properties = new PaymentRequestProperties
            {
                CustomerCode = customer.CustomerCode,
                PublicKey = account.PublicKey,
                Amount = request.Amount,
                TokenCode = request.TokenCode,
                Options = new PaymentRequestOptions()
                {
                    Memo = request.Memo,
                }
            };

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
                    .Select(kv => new PaymentRequestParams(kv.Key, kv.Value))
                    .ToList();
            }

            var paymentRequest = PaymentRequest.New(properties);

            _paymentRequestRepository.Add(paymentRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return paymentRequest;
        }
    }
}
