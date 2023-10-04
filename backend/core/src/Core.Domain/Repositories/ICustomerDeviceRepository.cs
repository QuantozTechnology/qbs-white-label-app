// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;

namespace Core.Domain.Repositories
{
    public interface ICustomerDeviceRepository : IRepository<CustomerOTPKeyStore>
    {
        public Task<CustomerOTPKeyStore?> GetAsync(string customerCode, CancellationToken cancellationToken = default);

        public Task<bool> HasPublicKeyAsync(string customerCode, string publicKey, CancellationToken cancellationToken = default);

        public Task<bool> HasOtpKeyAsync(string customerCode, CancellationToken cancellationToken = default);
    }
}
