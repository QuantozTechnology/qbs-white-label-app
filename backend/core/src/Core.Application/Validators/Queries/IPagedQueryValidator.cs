// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application;
using Core.Application.Queries.Interfaces;
using FluentValidation;

namespace Core.Application.Validators.Queries
{
    public class IPagedQueryValidator : AbstractValidator<IPagedQuery>
    {
        public IPagedQueryValidator()
        {
            RuleFor(c => c.PageSize).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Page).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
