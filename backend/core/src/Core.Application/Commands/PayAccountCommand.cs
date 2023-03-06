using Core.Application.Abstractions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands
{
    public class PayAccountCommand : IWithComplianceCheckCommand<Unit>
    {
        public required string CustomerCode { get; set; }
        public required string ToAccountCode { get; set; }
        public required string TokenCode { get; set; }
        public string? Memo { get; set; }
        public decimal Amount { get; set; }
        public bool? ShareName { get; set; } = false;
        public required string IP { get; set; }
    }

    public class PayAccountCommandHandler : IRequestHandler<PayAccountCommand>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PayAccountCommandHandler(ITransactionRepository transactionRepository,
            IPaymentRepository paymentRepository,
            IAccountRepository accountRepository,
            ICustomerRepository customerRepository,
            IUnitOfWork unitOfWork)
        {
            _transactionRepository = transactionRepository;
            _paymentRepository = paymentRepository;
            _accountRepository = accountRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(PayAccountCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var fromAccount = await _accountRepository.GetByCustomerCodeAsync(customer.CustomerCode, cancellationToken);
            var toAccount = await _accountRepository.GetByAccountCodeAsync(request.ToAccountCode, cancellationToken);

            var payment = customer.NewPaymentToAccount(fromAccount, toAccount, request.TokenCode, request.Amount, request.Memo, request.ShareName ?? false);

            var transactionCode = await _transactionRepository.CreatePaymentAsync(payment, request.IP, cancellationToken);
            payment.SetTransactionCode(transactionCode);

            _paymentRepository.Add(payment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
