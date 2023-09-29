// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

﻿using Core.Domain;
using Core.Domain.Abstractions;
using System.Linq.Expressions;

namespace Core.Application.Specifications
{
    public abstract class BaseSpecification<T> : ISpecification<T>
    {
        private IQueryable<T> query = Enumerable.Empty<T>().AsQueryable();

        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
        }

        public Expression<Func<T, bool>> Criteria { get; }

        public List<Expression<Func<T, object>>> Includes { get; } =
                                               new List<Expression<Func<T, object>>>();

        public List<string> IncludeStrings { get; } = new List<string>();


        protected virtual void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }

        protected virtual void AddInclude(string includeString)
        {
            IncludeStrings.Add(includeString);
        }

        protected virtual void ApplyPaging(int skip, int take)
        {
            if (take == 0)
            {
                take = int.MaxValue;
            }

            query = query.Skip(skip).Take(take);
        }

        // TODO: check the working of this
        protected virtual void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)
        {
            query = query.OrderByDescending(orderByDescendingExpression);
        }
    }
}
