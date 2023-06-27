// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Primitives.Offer
{
    public class OfferOptions
    {
        public bool IsOneOffPayment { get; set; } = false;
        public bool PayerCanChangeRequestedAmount { get; set; } = true;
        public DateTimeOffset? ExpiresOn { get; set; }
        public string? Memo { get; set; }
        public string? Name { get; set; }
        public ICollection<OfferParams>? Params { get; set; } = new List<OfferParams>();

    }
}
