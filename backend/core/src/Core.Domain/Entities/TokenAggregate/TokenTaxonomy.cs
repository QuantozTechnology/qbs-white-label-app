// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Entities.TokenAggregate
{
    public class TokenTaxonomy
    {
        public required string TokenCode { get; set; }

        public required string Name { get; set; }

        public required string IssuerAddress { get; set; }

        public string? Balance { get; set; }

        public required string Status { get; set; }

        public required DateTimeOffset Created { get; set; }

        public string? BlockchainId { get; set; }

        public TaxonomyResponse? Taxonomy { get; set; }

        public IDictionary<string, string>? Data { get; set; }

        public TokenTaxonomy()
        {

        }
    }

    public class TaxonomyResponse
    {
        public string? TaxonomySchemaCode { get; set; }

        public string? AssetUrl { get; set; }

        public string? TaxonomyProperties { get; set; }

        public string? Hash { get; set; }
    }
}
