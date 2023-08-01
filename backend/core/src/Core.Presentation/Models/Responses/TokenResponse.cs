// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.TokenAggregate;
using Core.Domain.Entities.TransactionAggregate;

namespace Core.Presentation.Models.Responses
{
    public class TokenResponse
    {
        public required string TokenCode { get; set; }

        public required string Name { get; set; }

        public required string IssuerAddress { get; set; }

        public required string Status { get; set; }

        public required DateTimeOffset Created { get; set; }


        public static TokenResponse FromToken(Token token)
        {
            return new TokenResponse
            {
                TokenCode = token.TokenCode,
                Name = token.Name,
                IssuerAddress = token.IssuerAddress,
                Status = token.Status,
                Created = token.Created,

            };
        }
    }
}
