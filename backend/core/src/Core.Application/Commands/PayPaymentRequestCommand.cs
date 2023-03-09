// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Abstractions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands
{
    public class PayPaymentRequestCommand : IWithComplianceCheckCommand<Unit>
    {
        public required string CustomerCode { get; set; }
        public required string PaymentRequestCode { get; set; }
        public decimal? Amount { get; set; }
        public required string IP { get; set; }
    }

    public class PayPaymentRequestCommandHandler : IRequestHandler<PayPaymentRequestCommand>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IPaymentRequestRepository _paymentRequestRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PayPaymentRequestCommandHandler(ITransactionRepository transactionRepository,
            IPaymentRepository paymentRepository,
            IPaymentRequestRepository paymentRequestRepository,
            IAccountRepository accountRepository,
            ICustomerRepository customerRepository,
            IUnitOfWork unitOfWork)
        {
            _transactionRepository = transactionRepository;
            _paymentRepository = paymentRepository;
            _paymentRequestRepository = paymentRequestRepository;
            _accountRepository = accountRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(PayPaymentRequestCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var account = await _accountRepository.GetByCustomerCodeAsync(customer.CustomerCode, cancellationToken);
            var paymentRequest = await _paymentRequestRepository.GetByCodeAsync(request.PaymentRequestCode, cancellationToken);

            // Start processing the payment request
            paymentRequest.Processing();
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var payment = customer.NewPaymentToPaymentRequest(account, paymentRequest, request.Amount);

            try
            {
                var transactionCode = await _transactionRepository.CreatePaymentAsync(payment, request.IP, cancellationToken);

                // If the transaction is successfully processed we set the transaction and update the payment request status to Paid
                payment.SetTransactionCode(transactionCode);
                paymentRequest.Paid(payment);

                _paymentRepository.Add(payment);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            catch (Exception)
            {
                // If the transaction fails we reset the payment request
                paymentRequest.ProcessingFailed();
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                throw;
            }

            return Unit.Value;
        }
    }
}
