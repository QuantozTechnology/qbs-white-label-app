// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Presentation.Models.Responses.CallbackResponses;

namespace Core.Presentation.Models.Responses.PaymentRequestResponses
{
    public class MerchantPaymentRequestResponse : PaymentRequestResponse
    {
        public required MerchantSettingsResponse MerchantSettings { get; set; }
        public required IEnumerable<CallbackResponse> Callbacks { get; set; }

        public new static MerchantPaymentRequestResponse FromPaymentRequest(PaymentRequest paymentRequest)
        {
            return new MerchantPaymentRequestResponse
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
                MerchantSettings = new MerchantSettingsResponse
                {
                    ReturnUrl = paymentRequest.MerchantSettings!.ReturnUrl,
                    RedirectUrl = $"/paymentrequests/merchant/{paymentRequest.Code}/pay"
                },
                Callbacks = paymentRequest.Callbacks.Select(c => CallbackResponse.FromCallback(c)),
                Payments = paymentRequest.Payments.Select(p => PaymentResponse.FromPayment(p))
            };
        }
    }

    public class MerchantSettingsResponse
    {
        public required string ReturnUrl { get; set; }
        public required string RedirectUrl { get; set; }
    }
}
