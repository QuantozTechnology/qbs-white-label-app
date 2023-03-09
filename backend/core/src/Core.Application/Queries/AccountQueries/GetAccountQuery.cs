// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.AccountQueries
{
    public class GetAccountQuery : IRequest<Account>
    {
        public string CustomerCode { get; set; }

        public GetAccountQuery(string customerCode)
        {
            CustomerCode = customerCode;
        }
    }

    public class GetAccountQueryHandler : IRequestHandler<GetAccountQuery, Account>
    {
        private readonly IAccountRepository _accountRepository;

        public GetAccountQueryHandler(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public Task<Account> Handle(GetAccountQuery request, CancellationToken cancellationToken)
        {
            return _accountRepository.GetByCustomerCodeAsync(request.CustomerCode);
        }
    }
}
