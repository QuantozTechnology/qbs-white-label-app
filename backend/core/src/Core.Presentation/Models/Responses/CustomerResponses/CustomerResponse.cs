// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;

namespace Core.Presentation.Models.Responses.CustomerResponses
{
    public class CustomerResponse
    {
        public required string Reference { get; set; }

        public required string TrustLevel { get; set; }

        public required string CurrencyCode { get; set; }

        public string? Email { get; set; }

        public required string Status { get; set; }

        public required string? BankAccountNumber { get; set; }

        public required bool IsBusiness { get; set; }

        public required IDictionary<string, string> Data { get; set; }

        internal static CustomerResponse FromCustomer(Customer customer)
        {
            return new CustomerResponse
            {
                Reference = customer.CustomerCode,
                TrustLevel = customer.TrustLevel,
                CurrencyCode = customer.CurrencyCode,
                Email = customer.Email,
                Status = customer.Status.ToString(),
                BankAccountNumber = customer.BankAccount,
                IsBusiness = customer.IsMerchant,
                Data = customer.Data
            };
        }
    }
}
