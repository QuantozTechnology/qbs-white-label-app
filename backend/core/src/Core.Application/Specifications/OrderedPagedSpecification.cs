// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Linq.Expressions;

namespace Core.Application.Specifications
{
    public class OrderedPagedSpecification<T> : BaseSpecification<T>
    {
        public OrderedPagedSpecification(Expression<Func<T, bool>> criteria, Expression<Func<T, object>> orderByDescendingExpression, int page, int pageSize)
        : base(criteria)
        {
            ApplyPaging((page - 1) * pageSize, pageSize);
            ApplyOrderByDescending(orderByDescendingExpression);
        }
    }
}
