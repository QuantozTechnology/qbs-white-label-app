// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;

namespace Core.Domain.Repositories
{
    public interface ICustomerRepository
    {
        public Task CreateAsync(Customer customer, string? ip = null, CancellationToken cancellationToken = default);

        public Task<Customer> GetAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task<IEnumerable<CustomerLimit>> GetLimitsAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task UpdateAsync(Customer customer, CancellationToken cancellationToken = default);
    }
}
