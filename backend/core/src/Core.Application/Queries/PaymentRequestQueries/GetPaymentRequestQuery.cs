using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.PaymentRequestQueries
{
    public class GetPaymentRequestQuery : IRequest<PaymentRequest>
    {
        public string PaymentRequestCode { get; set; }

        public GetPaymentRequestQuery(string paymentRequestCode)
        {
            PaymentRequestCode = paymentRequestCode;
        }
    }

    public class GetPaymentRequestQueryHandler : IRequestHandler<GetPaymentRequestQuery, PaymentRequest>
    {
        private readonly IPaymentRequestRepository _paymentRequestRepository;

        public GetPaymentRequestQueryHandler(IPaymentRequestRepository paymentRequestRepository)
        {
            _paymentRequestRepository = paymentRequestRepository;
        }

        public Task<PaymentRequest> Handle(GetPaymentRequestQuery request, CancellationToken cancellationToken)
        {
            return _paymentRequestRepository.GetByCodeAsync(request.PaymentRequestCode, cancellationToken);
        }
    }
}
