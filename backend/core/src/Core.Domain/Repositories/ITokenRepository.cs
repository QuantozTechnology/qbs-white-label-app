// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.TokenAggregate;
using Core.Domain.Primitives;

namespace Core.Domain.Repositories
{
    public interface ITokenRepository
    {
        public Task<Paged<Token>> GetAsync(string publicKey, TokenAvailability? availability, int page, int pageSize, CancellationToken cancellationToken = default);

        public Task<TokenTaxonomy> GetTokenDetailsAsync(string code, CancellationToken cancellationToken = default);
    }
}
