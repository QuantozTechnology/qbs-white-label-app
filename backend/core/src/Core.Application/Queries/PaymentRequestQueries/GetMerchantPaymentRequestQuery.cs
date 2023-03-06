using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.PaymentRequestQueries
{
    public class GetMerchantPaymentRequestQuery : IRequest<PaymentRequest>
    {
        public string PaymentRequestCode { get; set; }

        public GetMerchantPaymentRequestQuery(string paymentRequestCode)
        {
            PaymentRequestCode = paymentRequestCode;
        }
    }

    public class GetMerchantPaymentRequestQueryHandler : IRequestHandler<GetMerchantPaymentRequestQuery, PaymentRequest>
    {
        private readonly IPaymentRequestRepository _paymentRequestRepository;

        public GetMerchantPaymentRequestQueryHandler(IPaymentRequestRepository paymentRequestRepository)
        {
            _paymentRequestRepository = paymentRequestRepository;
        }

        public Task<PaymentRequest> Handle(GetMerchantPaymentRequestQuery request, CancellationToken cancellationToken)
        {
            return _paymentRequestRepository.GetByCodeForMerchantAsync(request.PaymentRequestCode, cancellationToken);
        }
    }
}
