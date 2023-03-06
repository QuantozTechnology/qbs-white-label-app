using Core.Domain;
using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Primitives.PaymentRequest;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.PaymentRequestCommands
{
    public class CreateMerchantPaymentRequestCommand : CreatePaymentRequestCommand
    {
        public required string? CallbackUrl { get; set; }

        public required string ReturnUrl { get; set; }
    }


    public class CreateMerchantPaymentRequestCommandHandler : IRequestHandler<CreateMerchantPaymentRequestCommand, PaymentRequest>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IPaymentRequestRepository _paymentRequestRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateMerchantPaymentRequestCommandHandler(
            ICustomerRepository customerRepository,
            IAccountRepository accountRepository,
            IPaymentRequestRepository paymentRequestRepository,
            IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _accountRepository = accountRepository;
            _paymentRequestRepository = paymentRequestRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<PaymentRequest> Handle(CreateMerchantPaymentRequestCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var account = await _accountRepository.GetByCustomerCodeAsync(customer.CustomerCode, cancellationToken);

            var properties = new MerchantPaymentRequestProperties
            {
                CustomerCode = customer.CustomerCode,
                PublicKey = account.PublicKey,
                Amount = request.Amount,
                TokenCode = request.TokenCode,
                MerchantSettings = new MerchantSettings(request.ReturnUrl)
                {
                    CallbackUrl = request.CallbackUrl
                },
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

            var paymentRequest = PaymentRequest.NewMerchant(properties);

            _paymentRequestRepository.Add(paymentRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return paymentRequest;
        }
    }
}
