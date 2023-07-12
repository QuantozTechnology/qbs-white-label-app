// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;

namespace Core.Domain.Repositories
{
    public interface IRepository<T>
    {
        public void Add(T entity);

        public void Update(T entity);

        public Task<T> FindAsync(int id, CancellationToken cancellationToken = default);

        Task<List<T>> ListAsync(ISpecification<T> specification, CancellationToken cancellationToken = default);

        public void AddRange(IEnumerable<T> entities);
    }
}
