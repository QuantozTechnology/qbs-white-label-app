// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Repositories
{
    public interface ITransactionRepository
    {
        public Task<string> CreatePaymentAsync(Payment payment, string? ip = null, CancellationToken cancellationToken = default);

        public Task CreateWithdrawAsync(Withdraw withdraw, string? ip = null, CancellationToken cancellationToken = default);

        public Task<Paged<Transaction>> GetAsync(string publicKey, int page, int pageSize, CancellationToken cancellationToken = default);

        public Task<Paged<Transaction>> GetAsync(Dictionary<string, string>? additionalParams = null, CancellationToken cancellationToken = default);

        public Task<WithdrawFees> GetWithdrawFeesAsync(Withdraw withdraw, CancellationToken cancellationToken = default);
    }
}
