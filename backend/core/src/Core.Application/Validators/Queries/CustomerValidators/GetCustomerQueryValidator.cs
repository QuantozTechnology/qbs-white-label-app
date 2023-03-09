// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application;
using Core.Application.Queries.CustomerQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.CustomerValidators
{
    public class GetCustomerQueryValidator : AbstractValidator<GetCustomerQuery>
    {
        public GetCustomerQueryValidator()
        {
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
