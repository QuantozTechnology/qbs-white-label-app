// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.ComponentModel.DataAnnotations;

namespace Web.Portal
{
    public class PortalOptions
    {
        public required AzureAdOptions AzureAd { get; set; }

        public required DeeplinksOptions Deeplinks { get; set; }
    }

    public class AzureAdOptions
    {
        [Required]
        public required string ClientId { get; set; }

        [Required]
        public required string Authority { get; set; }

        public bool ValidateAuthority { get; set; }

        [Required]
        public required string[] DefaultScopes { get; set; }
    }

    public class DeeplinksOptions
    {
        [Required]
        public required string PaymentRequests { get; set; }
    }
}