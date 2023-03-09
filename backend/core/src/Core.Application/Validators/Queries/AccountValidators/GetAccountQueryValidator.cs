// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.AccountQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.AccountValidators
{
    public class GetAccountQueryValidator : AbstractValidator<GetAccountQuery>
    {
        public GetAccountQueryValidator()
        {
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
