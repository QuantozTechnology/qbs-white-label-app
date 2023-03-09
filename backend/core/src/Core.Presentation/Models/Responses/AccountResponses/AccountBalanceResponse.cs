// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;

namespace Core.Presentation.Models.Responses.AccountResponses
{
    public class AccountBalanceResponse
    {
        public required string TokenCode { get; set; }

        public required decimal Balance { get; set; }

        public static AccountBalanceResponse FromAccountBalance(AccountBalance accountBalance)
        {
            return new AccountBalanceResponse
            {
                Balance = accountBalance.Balance,
                TokenCode = accountBalance.TokenCode
            };
        }
    }
}
