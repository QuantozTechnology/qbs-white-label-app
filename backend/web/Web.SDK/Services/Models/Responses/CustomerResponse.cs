// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Text.Json.Serialization;

namespace Web.SDK.Services.Models.Responses
{
    public class CustomerResponse
    {
        public required string Reference { get; set; }

        public required string TrustLevel { get; set; }

        public required string CurrencyCode { get; set; }

        public string? Email { get; set; }

        public required string Status { get; set; }

        public string? BankAccountNumber { get; set; }

        public required IDictionary<string, string> Data { get; set; }
    }
}
