// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.PaymentRequestCommands
{
    public class CancelPaymentRequestCommand : IRequest
    {
        public CancelPaymentRequestCommand(string customerCode, string paymentRequestCode)
        {
            CustomerCode = customerCode;
            PaymentRequestCode = paymentRequestCode;
        }

        public string CustomerCode { get; set; }

        public string PaymentRequestCode { get; set; }
    }


    public class CancelPaymentRequestCommandHandler : IRequestHandler<CancelPaymentRequestCommand>
    {
        private readonly IPaymentRequestRepository _paymentRequestRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CancelPaymentRequestCommandHandler(IPaymentRequestRepository paymentRequestRepository,
            IUnitOfWork unitOfWork)
        {
            _paymentRequestRepository = paymentRequestRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(CancelPaymentRequestCommand request, CancellationToken cancellationToken)
        {
            var paymentRequest = await _paymentRequestRepository.GetByCodeForCustomerAsync(request.CustomerCode, request.PaymentRequestCode, cancellationToken);
            paymentRequest.Cancel();
            _paymentRequestRepository.Update(paymentRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
