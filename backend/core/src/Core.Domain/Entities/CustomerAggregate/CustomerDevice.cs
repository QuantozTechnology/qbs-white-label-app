// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Primitives;

namespace Core.Domain.Entities.CustomerAggregate
{
    public class CustomerDevice : Entity
    {
        public string CustomerCode { get; set; }

        public List<string> PublicKeys { get; set; }

        public string OTPKey { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public CustomerDevice(string customerCode, List<string> publicKeys, string otpKey)
        {
            CustomerCode = customerCode;
            PublicKeys = publicKeys;
            OTPKey = otpKey;
            CreatedOn = DateTimeProvider.UtcNow;
            UpdatedOn = DateTimeProvider.UtcNow;
        }

        public static CustomerDevice NewDevice(string customerCode, List<string> publicKeys, string otpKey)
        {
            return new CustomerDevice(customerCode, publicKeys, otpKey);
        }

        // Required for EF Core
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public CustomerDevice() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    }
}
