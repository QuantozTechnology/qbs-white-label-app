// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CallbackAggregate;

namespace Core.Domain.Repositories
{
    public interface ICallbackRepository : IRepository<Callback>
    {
        public Task<Callback> GetAsync(string code, CancellationToken cancellationToken = default);

        public Task<IEnumerable<Callback>> GetLatestCreatedAsync(CancellationToken cancellationToken = default);
    }
}
