// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Primitives;
using System.ComponentModel.DataAnnotations;

namespace Core.Domain.Entities.CustomerAggregate
{
    public class CustomerDevicePublicKeys : Entity
    {
        [Required]
        public string PublicKey { get; set; }

        public int CustomerOTPKeyStoreId { get; set; }

        public CustomerOTPKeyStore CustomerOTPKeyStore { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public CustomerDevicePublicKeys(string publicKey, int customerOTPKeyStoreId)
        {
            PublicKey = publicKey;
            CustomerOTPKeyStoreId = customerOTPKeyStoreId;
            CreatedOn = DateTimeOffset.UtcNow;
            UpdatedOn = DateTimeOffset.UtcNow;
        }

        public static CustomerDevicePublicKeys NewCustomerDevicePublicKey(string publicKey, int customerOTPKeyStoreId)
        {
            return new CustomerDevicePublicKeys(publicKey, customerOTPKeyStoreId);
        }

        // Required for EF Core
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public CustomerDevicePublicKeys() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    }
}