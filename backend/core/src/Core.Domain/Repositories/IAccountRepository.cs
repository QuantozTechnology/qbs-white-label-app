// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;

namespace Core.Domain.Repositories
{
    public interface IAccountRepository
    {
        public Task CreateAsync(Account account, CancellationToken cancellationToken = default);

        public Task<Account> GetByCustomerCodeAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task<Account> GetByAccountCodeAsync(string accountCode, CancellationToken cancellationToken = default);

        public Task<bool> HasAccountAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task<IEnumerable<AccountBalance>> GetBalancesAsync(string publicKey, CancellationToken cancellationToken = default);
    }
}
