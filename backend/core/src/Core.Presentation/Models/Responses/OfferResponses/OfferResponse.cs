// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.OfferAggregate;
using Core.Presentation.Models.Responses.PaymentRequestResponses;

namespace Core.Presentation.Models.Responses.OfferResponses
{
    public class OfferResponse
    {
        public required string OfferCode { get; set; }

        public required string SourceTokenCode { get; set; }

        public required decimal SourceTokenAmount { get; set; }

        public decimal? SourceTokenRemainingAmount { get; set; }

        public required string DestinationTokenCode { get; set; }

        public required decimal DestinationTokenAmount { get; set; }

        public decimal? DestinationTokenRemainingAmount { get; set; }

        public required string Status { get; set; }

        public required string OfferAction { get; set; }

        public required long CreatedOn { get; set; }

        public long? UpdatedOn { get; set; }

        public OfferOptionsResponse? Options { get; set; }

        public IEnumerable<PaymentResponse>? Payments { get; set; }

        public static OfferResponse FromOffer(Offer offer)
        {
            return new OfferResponse
            {
                OfferCode = offer.OfferCode,
                Status = offer.Status.ToString(),
                OfferAction = offer.OfferAction.ToString(),
                SourceTokenCode = offer.SourceTokenCode,
                SourceTokenAmount = offer.SourceTokenAmount,
                SourceTokenRemainingAmount = offer.SourceTokenRemainingAmount,
                DestinationTokenCode = offer.DestinationTokenCode,
                DestinationTokenAmount = offer.DestinationTokenAmount,
                DestinationTokenRemainingAmount = offer.DestinationTokenRemainingAmount,
                CreatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(offer.CreatedOn),
                UpdatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(offer.UpdatedOn),
                Options = new OfferOptionsResponse
                {
                    Params = offer.Options.Params?.ToDictionary(d => d.Key, d => d.Value),
                    Name = offer.Options.Name,
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
        public string? Name { get; set; }
        public bool IsOneOffPayment { get; set; }
        public bool PayerCanChangeRequestedAmount { get; set; }
        public IDictionary<string, string>? Params { get; set; }
    }
}
