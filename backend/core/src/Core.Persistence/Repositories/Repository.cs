// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Core.Domain.Exceptions;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

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

        public void AddRange(IEnumerable<T> entities)
        {
            Context.Set<T>().AddRange(entities);
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

        public async Task<List<T>> ListAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
        {
            var query = Query();

            var queryableResultWithIncludes = specification
                .Includes
                .Aggregate(query,
                    (current, include) => current.Include(include));

            var secondaryResult = specification
                .IncludeStrings
                .Aggregate(queryableResultWithIncludes,
                    (current, include) => current.Include(include));

            return await secondaryResult
                .Where(specification.Criteria)
                .ToListAsync(cancellationToken);
        }
    }
}
