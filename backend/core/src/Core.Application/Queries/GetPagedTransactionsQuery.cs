using Core.Application.Queries.Interfaces;
using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries
{
    public class GetPagedTransactionsQuery : IRequest<Paged<Transaction>>, IPagedQuery
    {
        public string CustomerCode { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }

        public GetPagedTransactionsQuery(string customerCode, int page, int pageSize)
        {
            CustomerCode = customerCode;
            Page = page;
            PageSize = pageSize;
        }
    }

    public class GetPagedTransactionsQueryHandler : IRequestHandler<GetPagedTransactionsQuery, Paged<Transaction>>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IAccountRepository _accountRepository;

        public GetPagedTransactionsQueryHandler(ITransactionRepository transactionRepository,
            IAccountRepository accountRepository)
        {
            _transactionRepository = transactionRepository;
            _accountRepository = accountRepository;
        }

        public async Task<Paged<Transaction>> Handle(GetPagedTransactionsQuery request, CancellationToken cancellationToken)
        {
            var account = await _accountRepository.GetByCustomerCodeAsync(request.CustomerCode);
            return await _transactionRepository.GetAsync(account.PublicKey, request.Page, request.PageSize);
        }
    }
}
