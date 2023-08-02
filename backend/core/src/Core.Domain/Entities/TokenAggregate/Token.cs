// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Entities.TokenAggregate
{
    public class Token
    {
        public required string TokenCode { get; set; }

        public required string Name { get; set; }

        public required string IssuerAddress { get; set; }

        public string? Balance { get; set; }

        public required string Status { get; set; }

        public required DateTimeOffset Created { get; set; }


        public Token()
        {

        }
    }
}
