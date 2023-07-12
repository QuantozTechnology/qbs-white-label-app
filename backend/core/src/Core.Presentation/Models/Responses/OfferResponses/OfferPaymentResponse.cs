// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.TransactionAggregate;

namespace Core.Presentation.Models.Responses.OfferResponses
{
    public class OfferPaymentResponse
    {
        public string? TransactionCode { get; set; }
        public required string SenderPublicKey { get; set; }
        public required string ReceiverPublicKey { get; set; }
        public required string Amount { get; set; }
        public required string TokenCode { get; set; }
        public string? Memo { get; set; }
        public long CreatedOn { get; set; }
        public long? UpdatedOn { get; set; }

        public static OfferPaymentResponse FromPayment(Payment payment)
        {
            return new OfferPaymentResponse
            {
                TransactionCode = payment.TransactionCode,
                SenderPublicKey = payment.SenderPublicKey,
                ReceiverPublicKey = payment.ReceiverPublicKey,
                TokenCode = payment.TokenCode,
                Memo = payment.Memo,
                Amount = payment.Amount.ToString(),
                CreatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(payment.CreatedOn),
                UpdatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(payment.UpdatedOn)
            };
        }
    }
}
