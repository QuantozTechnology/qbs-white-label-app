// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.OfferAggregate;
using Core.Presentation.Models.Requests.OfferRequests;
using Core.Presentation.Models.Responses.PaymentRequestResponses;

namespace Core.Presentation.Models.Responses.OfferResponses
{
    public class OfferResponse
    {
        public required string OfferCode { get; set; }

        public required string CustomerCode { get; set; }

        public required string PublicKey { get; set; }

        public required OfferResponseToken SourceToken { get; set; }

        public required OfferResponseToken DestinationToken { get; set; }

        public required string Status { get; set; }

        public required string Action { get; set; }

        public required long CreatedOn { get; set; }

        public long? UpdatedOn { get; set; }

        public OfferOptionsResponse? Options { get; set; }

        public IEnumerable<PaymentResponse>? Payments { get; set; }

        public static OfferResponse FromOffer(Offer offer)
        {
            return new OfferResponse
            {
                OfferCode = offer.OfferCode,
                CustomerCode = offer.CustomerCode,
                PublicKey = offer.PublicKey,
                Status = offer.Status.ToString(),
                Action = offer.OfferAction.ToString(),
                SourceToken = new OfferResponseToken
                {
                    TokenCode = offer.SourceTokenCode,
                    TotalAmount = offer.SourceTokenAmount.ToString(),
                    RemainingAmount = offer.SourceTokenRemainingAmount?.ToString()
                },
                DestinationToken = new OfferResponseToken
                {
                    TokenCode = offer.DestinationTokenCode,
                    TotalAmount = offer.DestinationTokenAmount.ToString(),
                    RemainingAmount = offer.DestinationTokenRemainingAmount?.ToString()
                },
                CreatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(offer.CreatedOn),
                UpdatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(offer.UpdatedOn),
                Options = new OfferOptionsResponse
                {
                    Params = offer.Options.Params?.ToDictionary(d => d.Key, d => d.Value),
                    ShareName = offer.Options.Name,
                    ExpiresOn = DateTimeProvider.ToUnixTimeInMilliseconds(offer.Options.ExpiresOn),
                    Memo = offer.Options.Memo,
                    IsOneOffPayment = offer.Options.IsOneOffPayment,
                    PayerCanChangeRequestedAmount = offer.Options.PayerCanChangeRequestedAmount
                },
                Payments = offer.Payments.Select(p => PaymentResponse.FromPayment(p))?.OrderByDescending(p => p.CreatedOn)
            };
        }
    }

    public class OfferOptionsResponse
    {
        public long? ExpiresOn { get; set; }
        public string? Memo { get; set; }
        public string? ShareName { get; set; }
        public bool IsOneOffPayment { get; set; }
        public bool PayerCanChangeRequestedAmount { get; set; }
        public IDictionary<string, string>? Params { get; set; }
    }

    public class OfferResponseToken
    {
        public required string TokenCode { get; set; }
        public required string TotalAmount { get; set; }
        public string? RemainingAmount { get; set; }
    }
}
