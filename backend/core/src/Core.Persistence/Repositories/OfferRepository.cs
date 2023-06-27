// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.OfferAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Core.Persistence.Repositories
{
    public class OfferRepository : Repository<Offer>, IOfferRepository
    {
        public OfferRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<Offer> GetByOfferCodeAsync(string offerCode, CancellationToken cancellationToken = default)
            {
                var offer = await Query().FirstOrDefaultAsync(pr => pr.OfferCode == offerCode, cancellationToken);

                return offer;
            }
    }
}
