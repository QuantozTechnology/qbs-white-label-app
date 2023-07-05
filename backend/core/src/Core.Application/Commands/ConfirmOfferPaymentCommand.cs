// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Abstractions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands
{
    public class ConfirmOfferPaymentCommand : IWithComplianceCheckCommand<Unit>
    {
        public required string CustomerCode { get; set; }
        public required string OfferCode { get; set; }
        public required decimal Amount { get; set; }
        public required string IP { get; set; }
    }

    public class ConfirmOfferPaymentCommandHandler : IRequestHandler<ConfirmOfferPaymentCommand>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IOfferRepository _offerRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ConfirmOfferPaymentCommandHandler(ITransactionRepository transactionRepository,
            IPaymentRepository paymentRepository,
            IOfferRepository offerRepository,
            IAccountRepository accountRepository,
            ICustomerRepository customerRepository,
            IUnitOfWork unitOfWork)
        {
            _transactionRepository = transactionRepository;
            _paymentRepository = paymentRepository;
            _offerRepository = offerRepository;
            _accountRepository = accountRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(ConfirmOfferPaymentCommand request, CancellationToken cancellationToken)
        {
            // Get scanner account details
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var account = await _accountRepository.GetByCustomerCodeAsync(customer.CustomerCode, cancellationToken);

            // Get offer details
            var offer = await _offerRepository.GetByOfferCodeAsync(request.OfferCode, cancellationToken);

            // Start processing the payment request
            offer.Processing();

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var payments = customer.NewPaymentsToOffer(account, offer, request.Amount);

            try
            {
                var transactionCode = await _transactionRepository.CreatePaymentsAsync(payments, request.IP, cancellationToken);

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
