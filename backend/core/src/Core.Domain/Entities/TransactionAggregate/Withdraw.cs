// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Entities.TransactionAggregate
{
    public class Withdraw
    {
        public required string PublicKey { get; set; }
        public required string TokenCode { get; set; }
        public decimal Amount { get; set; }
        public string? Memo { get; set; }
    }
}
