// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Web.SDK.Services.Models.Responses
{
    public class TransactionResponse
    {
        public required string TransactionCode { get; set; }

        public string? SenderAccountAddress { get; set; }

        public string? ReceiverAccountAddress { get; set; }

        public required decimal Amount { get; set; }

        public required string TokenCode { get; set; }

        public required DateTime Created { get; set; }

        public required string Status { get; set; }

        public required string Type { get; set; }

        public required string CryptoCode { get; set; }

        public string? Memo { get; set; }

        public required string Direction { get; set; }
    }
}
