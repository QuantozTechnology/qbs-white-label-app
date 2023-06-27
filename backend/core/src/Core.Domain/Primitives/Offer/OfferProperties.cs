// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Primitives.Offer
{
    public class OfferProperties
    {
        public required string CustomerCode { get; set; }

        public required string PublicKey { get; set; }

        public required string SourceTokenCode { get; set; }

        public required decimal SourceTokenAmount { get; set; }

        public decimal? SourceTokenRemainingAmount { get; set; }

        public required string DestinationTokenCode { get; set; }

        public required decimal DestinationTokenAmount { get; set; }

        public decimal? DestinationTokenRemainingAmount { get; set; }

        public required string OfferAction { get; set; }

        public string? OfferCode { get; set; }

        public required decimal PricePerUnit { get; set; }

        public OfferOptions Options { get; set; } = new OfferOptions();
    }
}