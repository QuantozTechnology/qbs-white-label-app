// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Primitives;
using System.ComponentModel.DataAnnotations;

namespace Core.Domain.Entities.CustomerAggregate
{
    public class CustomerOTPKeyStore : Entity
    {
        [Required]
        public string CustomerCode { get; set; }

        [Required]
        public string OTPKey { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public ICollection<CustomerDevicePublicKeys> PublicKeys { get; set; } = new List<CustomerDevicePublicKeys>();

        public CustomerOTPKeyStore(string customerCode, string otpKey)
        {
            CustomerCode = customerCode;
            OTPKey = otpKey;
            CreatedOn = DateTimeProvider.UtcNow;
            UpdatedOn = DateTimeProvider.UtcNow;
        }

        public static CustomerOTPKeyStore New(string customerCode, string otpKey, string publicKey)
        {
            var customerOTPKeyStore = new CustomerOTPKeyStore(customerCode, otpKey);
            customerOTPKeyStore.PublicKeys.Add(new CustomerDevicePublicKeys(publicKey, customerOTPKeyStore.Id));
            return customerOTPKeyStore;
        }

        // Required for EF Core
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public CustomerOTPKeyStore() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    }
}