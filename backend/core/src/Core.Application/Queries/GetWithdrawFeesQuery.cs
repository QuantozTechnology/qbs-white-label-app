using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries
{
    public class GetWithdrawFeesQuery : IRequest<WithdrawFees>
    {
        public string CustomerCode { get; set; }

        public string TokenCode { get; set; }

        public decimal Amount { get; set; }

        public GetWithdrawFeesQuery(string customerCode,
            string tokenCode, decimal amount)
        {
            CustomerCode = customerCode;
            TokenCode = tokenCode;
            Amount = amount;
        }
    }

    public class GetWithdrawFeesQueryHandler : IRequestHandler<GetWithdrawFeesQuery, WithdrawFees>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ITransactionRepository _transactionRepository;

        public GetWithdrawFeesQueryHandler(IAccountRepository accountRepository,
            ITransactionRepository transactionRepository)
        {
            _accountRepository = accountRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<WithdrawFees> Handle(GetWithdrawFeesQuery request, CancellationToken cancellationToken)
        {
            var account = await _accountRepository.GetByCustomerCodeAsync(request.CustomerCode, cancellationToken);

            var withdraw = new Withdraw()
            {
                PublicKey = account.PublicKey,
                TokenCode = request.TokenCode,
                Amount = request.Amount
            };

            return await _transactionRepository.GetWithdrawFeesAsync(withdraw);
        }
    }
}
