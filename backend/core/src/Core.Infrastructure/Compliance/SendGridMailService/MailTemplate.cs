// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Newtonsoft.Json;

namespace Core.Infrastructure.Compliance.SendGridMailService
{
    public class MailTemplate
    {
        [JsonProperty("customerFullName")]
        public string? CustomerFullName { get; set; }

        [JsonProperty("amount")]
        public string? Amount { get; set; }

        [JsonProperty("accountCode")]
        public string? AccountCode { get; set; }

        [JsonProperty("customerBankAccount")]
        public string? BankAccount { get; set; }

        [JsonProperty("transactionCode")]
        public string? TransactionCode { get; set; }

        [JsonProperty("payoutAmount")]
        public string? PayoutAmount { get; set; }

        [JsonProperty("createdDate")]
        public string? CreatedDate { get; set; }

        [JsonProperty("finishedDate")]
        public string? FinishedDate { get; set; }
    }

    public class OTPCodeMailTemplate
    {
        [JsonProperty("customerFullName")]
        public string? CustomerFullName { get; set; }

        [JsonProperty("otpCode")]
        public string? OTPCode { get; set; }
    }
}
