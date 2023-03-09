// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Entities.AccountAggregate
{
    public class Account
    {
        public required string CustomerCode { get; set; }
        public required string AccountCode { get; set; }
        public required string PublicKey { get; set; }

        public Account()
        {
        }

        public static Account NewAccount(string customerCode)
        {
            return new Account
            {
                CustomerCode = customerCode,
                PublicKey = string.Empty,
                AccountCode = string.Empty
            };
        }
    }
}
