// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Primitives
{
    public class PaymentProperties
    {
        public required string SenderPublicKey { get; set; }
        public required string ReceiverPublicKey { get; set; }
        public string? Name { get; set; }
        public required string TokenCode { get; set; }
        public decimal Amount { get; set; }
        public string? Memo { get; set; }
        public int? PaymentRequestId { get; set; }
        public required string SenderAccountCode { get; set; }
    }
}
