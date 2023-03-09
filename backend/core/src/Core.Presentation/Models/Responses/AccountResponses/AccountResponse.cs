// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;

namespace Core.Presentation.Models.Responses.AccountResponses
{
    public class AccountResponse
    {
        public required string PublicAddress { get; set; }

        public required string AccountCode { get; set; }

        public static AccountResponse FromAccount(Account account)
        {
            return new AccountResponse
            {
                PublicAddress = account.PublicKey,
                AccountCode = account.AccountCode
            };
        }
    }
}
