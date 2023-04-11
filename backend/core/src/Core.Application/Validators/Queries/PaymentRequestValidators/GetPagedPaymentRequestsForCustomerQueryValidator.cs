// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Queries.PaymentRequestQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.PaymentRequestValidators
{
    public class GetPagedPaymentRequestsForCustomerQueryValidator :  AbstractValidator<GetPagedPaymentRequestsForCustomerQuery>
    {
        public GetPagedPaymentRequestsForCustomerQueryValidator()
        {
            Include(new IPagedQueryValidator());

            RuleFor(c => c.CustomerCode)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Status)
                .IsInEnum()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
