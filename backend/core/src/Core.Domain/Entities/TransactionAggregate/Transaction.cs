// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Entities.TransactionAggregate
{
    public class Transaction
    {
        public required string TransactionCode { get; set; }

        public string? FromAccountCode { get; set; }

        public string? ToAccountCode { get; set; }

        public required decimal Amount { get; set; }

        public required string TokenCode { get; set; }

        public required DateTimeOffset Created { get; set; }

        public required string Status { get; set; }

        public required string Type { get; set; }

        public string? Memo { get; set; }

        public required string Direction { get; set; }

        public Payment? Payment { get; set; }

        public Transaction()
        {

        }
    }
}
