// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.TokenAggregate;

namespace Core.Presentation.Models.Responses
{
    public class TokenDataResponse
    {
        public required string Code { get; set; }

        public required string Name { get; set; }

        public required string IssuerAddress { get; set; }

        public required string Status { get; set; }

        public string? Balance { get; set; }

        public required long Created { get; set; }

        public TokenTaxonomyResponse? Taxonomy { get; set; }

        public IDictionary<string, string>? Data { get; set; }


        public static TokenDataResponse FromToken(TokenTaxonomy token)
        {
            return new TokenDataResponse
            {
                Code = token.TokenCode,
                Name = token.Name,
                IssuerAddress = token.IssuerAddress,
                Balance = token.Balance,
                Status = token.Status,
                Created = DateTimeProvider.ToUnixTimeInMilliseconds(token.Created),
                Taxonomy = token.Taxonomy != null ? new TokenTaxonomyResponse
                {
                    TaxonomySchemaCode = token.Taxonomy?.TaxonomySchemaCode,
                    AssetUrl = token.Taxonomy?.AssetUrl,
                    TaxonomyProperties = token.Taxonomy?.TaxonomyProperties,
                    Hash = token.Taxonomy?.Hash
                } : null,
                Data = token.Data
            };
        }
    }

    public class TokenTaxonomyResponse
    {
        public string? TaxonomySchemaCode { get; set; }

        public string? AssetUrl { get; set; }

        public string? TaxonomyProperties { get; set; }

        public string? Hash { get; set; }
    }
}
