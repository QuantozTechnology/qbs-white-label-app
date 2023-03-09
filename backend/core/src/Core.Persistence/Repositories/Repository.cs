// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Domain.Primitives;
using Core.Domain.Repositories;

namespace Core.Persistence.Repositories
{
    public abstract class Repository<T> : IRepository<T> where T : Entity
    {
        protected DatabaseContext Context { get; private set; }

        protected Repository(DatabaseContext context)
        {
            Context = context;
        }

        public void Add(T entity)
        {
            Context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            Context.Set<T>().Update(entity);
        }

        public IQueryable<T> Query()
        {
            return Context.Set<T>().AsQueryable();
        }

        public async Task<T> FindAsync(int id, CancellationToken cancellationToken = default)
        {
            var entity = await Context.Set<T>().FindAsync(id, cancellationToken);

            if (entity == null)
            {
                throw new CustomErrorsException(PersistenceErrorCode.NotFoundError.ToString(), id.ToString(),
                   "An entity was not found matching the provided identifier.");
            }

            return entity;
        }
    }
}
