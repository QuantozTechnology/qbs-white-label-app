// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.OfferAggregate;
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
        public string? SenderAccountCode { get; set; }
        public int? PaymentRequestId { get; set; }
        public int? OfferId { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset? UpdatedOn { get; set; }

        public PaymentRequest? PaymentRequest { get; set; }
        public Offer? Offer { get; set; }

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
                CreatedOn = DateTimeProvider.UtcNow,
                SenderAccountCode = properties.SenderAccountCode
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
                CreatedOn = DateTimeProvider.UtcNow,
                SenderAccountCode = properties.SenderAccountCode
            };
        }

        public static Payment[] NewToOffer(PaymentProperties[] properties)
        {
            var payments = new List<Payment>();

            foreach (var props in properties)
            {
                Payment payment = new()
                {
                    SenderPublicKey = props.SenderPublicKey,
                    ReceiverPublicKey = props.ReceiverPublicKey,
                    SenderName = props.Name,
                    TokenCode = props.TokenCode,
                    Amount = props.Amount,
                    Memo = props.Memo,
                    OfferId = props.OfferId,
                    SenderAccountCode = props.SenderAccountCode,
                    CreatedOn = DateTimeProvider.UtcNow,
                };

                payments.Add(payment);
            }

            return payments.ToArray();
        }

        public void SetTransactionCode(string transactionCode)
        {
            UpdatedOn = DateTimeProvider.UtcNow;
            TransactionCode = transactionCode;
        }
    }
}
