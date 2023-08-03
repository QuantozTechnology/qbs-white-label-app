// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.TokenAggregate;

namespace Core.Presentation.Models.Responses
{
    public class TokenResponse
    {
        public required string Code { get; set; }

        public required string Name { get; set; }

        public required string IssuerAddress { get; set; }

        public required string Status { get; set; }

        public string? Balance { get; set; }

        public required DateTimeOffset Created { get; set; }


        public static TokenResponse FromToken(Token token)
        {
            return new TokenResponse
            {
                Code = token.TokenCode,
                Name = token.Name,
                IssuerAddress = token.IssuerAddress,
                Balance = token.Balance,
                Status = token.Status,
                Created = token.Created,
            };
        }
    }
}
