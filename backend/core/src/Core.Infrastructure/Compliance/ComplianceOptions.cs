﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.ComponentModel.DataAnnotations;
namespace Core.Infrastructure.Compliance
{
    public class ComplianceOptions
    {
        public string? BlacklistedIsps { get; set; }

        public string? BlacklistedCountries { get; set; }

        [Required]
        public required TrustlevelOptions PrivateTrustlevels { get; set; }

        [Required]
        public required TrustlevelOptions MerchantTrustlevels { get; set; }
    }

    public class TrustlevelOptions
    {
        [Required]
        public required string Tier1 { get; set; }

        [Required]
        public required string Tier2 { get; set; }

        [Required]
        public required string Tier3 { get; set; }
    }
}
