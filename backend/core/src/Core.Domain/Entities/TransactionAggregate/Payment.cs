// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Entities.TransactionAggregate
{
    public class Payment : Entity
    {
        public required string SenderPublicKey { get; set; }
        public required string ReceiverPublicKey { get; set; }
        public string? SenderName { get; set; }
        public string? ReceiverName { get; set; }
        public required string TokenCode { get; set; }
        public decimal Amount { get; set; }
        public string? Memo { get; set; }
        public string? TransactionCode { get; set; }
        public int? PaymentRequestId { get; set; }
        public PaymentRequest? PaymentRequest { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset? UpdatedOn { get; set; }

        public static Payment NewToPaymentRequest(PaymentProperties properties)
        {
            return new Payment
            {
                SenderPublicKey = properties.SenderPublicKey,
                ReceiverPublicKey = properties.ReceiverPublicKey,
                ReceiverName = properties.Name,
                Amount = properties.Amount,
                TokenCode = properties.TokenCode,
                Memo = properties.Memo,
                PaymentRequestId = properties.PaymentRequestId,
                CreatedOn = DateTimeProvider.UtcNow
            };
        }

        public static Payment NewToAccount(PaymentProperties properties)
        {
            return new Payment
            {
                SenderPublicKey = properties.SenderPublicKey,
                ReceiverPublicKey = properties.ReceiverPublicKey,
                SenderName = properties.Name,
                Amount = properties.Amount,
                TokenCode = properties.TokenCode,
                Memo = properties.Memo,
                PaymentRequestId = properties.PaymentRequestId,
                CreatedOn = DateTimeProvider.UtcNow
            };
        }

        public void SetTransactionCode(string transactionCode)
        {
            UpdatedOn = DateTimeProvider.UtcNow;
            TransactionCode = transactionCode;
        }
    }
}
