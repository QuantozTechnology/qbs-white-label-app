// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
