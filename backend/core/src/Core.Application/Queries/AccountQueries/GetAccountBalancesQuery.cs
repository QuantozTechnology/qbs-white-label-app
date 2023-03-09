// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.AccountQueries
{
    public class GetAccountBalancesQuery : IRequest<IEnumerable<AccountBalance>>
    {
        public string CustomerCode { get; set; }

        public GetAccountBalancesQuery(string customerCode)
        {
            CustomerCode = customerCode;
        }
    }

    public class GetAccountBalancesQueryHandler : IRequestHandler<GetAccountBalancesQuery, IEnumerable<AccountBalance>>
    {
        private readonly IAccountRepository _accountRepository;

        public GetAccountBalancesQueryHandler(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<IEnumerable<AccountBalance>> Handle(GetAccountBalancesQuery request, CancellationToken cancellationToken)
        {
            var account = await _accountRepository.GetByCustomerCodeAsync(request.CustomerCode);
            return await _accountRepository.GetBalancesAsync(account.PublicKey);
        }
    }
}
