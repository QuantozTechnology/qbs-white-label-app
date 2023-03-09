// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CallbackAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Core.Persistence.Repositories
{
    public class CallbackRepository : Repository<Callback>, ICallbackRepository
    {
        public CallbackRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<Callback> GetAsync(string code, CancellationToken cancellationToken = default)
        {
            var callback = await Query().FirstOrDefaultAsync(pr => pr.Code == code, cancellationToken);

            if (callback == null)
            {
                throw new CustomErrorsException(PersistenceErrorCode.NotFoundError.ToString(), code,
                    "A callback was not found matching the provided code.");
            }

            return callback;
        }

        public async Task<IEnumerable<Callback>> GetLatestCreatedAsync(CancellationToken cancellationToken = default)
        {
            var latestCallbacks = await Query()
                .Where(c => c.Status == CallbackStatus.Created)
                .Take(20)
                .ToListAsync(cancellationToken);

            return latestCallbacks;
        }
    }
}
