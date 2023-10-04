// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Core.Persistence.Repositories
{
    public class CustomerDeviceRepository : Repository<CustomerOTPKeyStore>, ICustomerDeviceRepository
    {
        public CustomerDeviceRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<CustomerOTPKeyStore?> GetAsync(string customerCode, CancellationToken cancellationToken = default)
        {
            return await Query()
                .Include(c => c.PublicKeys)
                .FirstOrDefaultAsync(c => c.CustomerCode == customerCode, cancellationToken);
        }

        public async Task<bool> HasPublicKeyAsync(string customerCode, string publicKey, CancellationToken cancellationToken = default)
        {
            var customerDevice = await Query()
                 .FirstOrDefaultAsync(cd => cd.CustomerCode == customerCode, cancellationToken);

            return customerDevice != null && customerDevice.PublicKeys.Any(pk => pk.PublicKey == publicKey);
        }

        public async Task<bool> HasOtpKeyAsync(string customerCode, CancellationToken cancellationToken = default)
        {
            var customerDevice = await Query().FirstOrDefaultAsync(cd => cd.CustomerCode == customerCode, cancellationToken);

            return customerDevice != null && !string.IsNullOrWhiteSpace(customerDevice.OTPKey);
        }
    }
}
