// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands;
using FluentValidation;

namespace Core.Application.Validators.Commands
{
    public class PayPaymentRequestCommandValidator : AbstractValidator<PayPaymentRequestCommand>
    {
        public PayPaymentRequestCommandValidator()
        {
            RuleFor(c => c.CustomerCode)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.PaymentRequestCode)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Amount)
                .GreaterThan(0)
                .When(c => c.Amount != null)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
