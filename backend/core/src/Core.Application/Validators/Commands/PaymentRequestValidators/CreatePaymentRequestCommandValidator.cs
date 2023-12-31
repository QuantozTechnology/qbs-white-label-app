﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.PaymentRequestCommands;
using Core.Domain;
using FluentValidation;

namespace Core.Application.Validators.Commands.PaymentRequestValidators
{
    public class CreatePaymentRequestCommandValidator : AbstractValidator<CreatePaymentRequestCommand>
    {
        public CreatePaymentRequestCommandValidator()
        {
            RuleFor(c => c.CustomerCode)
                .NotNull()
                .Length(1, 40)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.TokenCode)
                .NotNull()
                .Length(1, 12)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Amount)
                .GreaterThan(0)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Memo)
                .Length(1, 28)
                .When(c => c.Memo != null)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.ExpiresOn)
                .GreaterThan(DateTimeProvider.UnixTimeInMilliseconds)
                .When(c => c.ExpiresOn != null)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleForEach(c => c.Params!.Keys)
                .NotEmpty()
                .Length(1, 50)
                .When(c => c.Params != null)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleForEach(c => c.Params!.Values)
                .NotEmpty()
                .Length(1, 50)
                .When(c => c.Params != null)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
