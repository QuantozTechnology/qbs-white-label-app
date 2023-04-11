// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.PaymentRequestAggregate;

namespace Core.Presentation.Models.Responses.PaymentRequestResponses
{
    public class PaymentRequestResponse
    {
        public required string Code { get; set; }

        public required string TokenCode { get; set; }

        public decimal RequestedAmount { get; set; }

        public required string Status { get; set; }

        public required long CreatedOn { get; set; }

        public long? UpdatedOn { get; set; }

        public PaymentRequestOptionsResponse? Options { get; set; }

        public IEnumerable<PaymentResponse>? Payments { get; set; }

        public static PaymentRequestResponse FromPaymentRequest(PaymentRequest paymentRequest)
        {
            return new PaymentRequestResponse
            {
                Code = paymentRequest.Code,
                Status = paymentRequest.Status.ToString(),
                RequestedAmount = paymentRequest.RequestedAmount,
                TokenCode = paymentRequest.TokenCode,
                CreatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(paymentRequest.CreatedOn),
                UpdatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(paymentRequest.UpdatedOn),
                Options = new PaymentRequestOptionsResponse
                {
                    Params = paymentRequest.Options.Params?.ToDictionary(d => d.Key, d => d.Value),
                    Name = paymentRequest.Options.Name,
                    ExpiresOn = DateTimeProvider.ToUnixTimeInMilliseconds(paymentRequest.Options.ExpiresOn),
                    Memo = paymentRequest.Options.Memo,
                    IsOneOffPayment = paymentRequest.Options.IsOneOffPayment,
                    PayerCanChangeRequestedAmount = paymentRequest.Options.PayerCanChangeRequestedAmount
                },
                Payments = paymentRequest.Payments.Select(p => PaymentResponse.FromPayment(p))?.OrderByDescending(p => p.CreatedOn)
            };
        }
    }

    public class PaymentRequestOptionsResponse
    {
        public long? ExpiresOn { get; set; }
        public string? Memo { get; set; }
        public string? Name { get; set; }
        public bool IsOneOffPayment { get; set; }
        public bool PayerCanChangeRequestedAmount { get; set; }
        public IDictionary<string, string>? Params { get; set; }
    }
}