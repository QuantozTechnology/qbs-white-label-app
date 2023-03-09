// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Repositories
{
    public interface IRepository<T>
    {
        public void Add(T entity);

        public void Update(T entity);

        public Task<T> FindAsync(int id, CancellationToken cancellationToken = default);
    }
}
