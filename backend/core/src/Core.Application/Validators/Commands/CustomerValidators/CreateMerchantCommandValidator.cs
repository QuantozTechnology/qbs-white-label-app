// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.CustomerCommands;
using FluentValidation;

namespace Core.Application.Validators.Commands.CustomerValidators
{
    public class CreateMerchantCommandValidator : AbstractValidator<CreateMerchantCommand>
    {
        public CreateMerchantCommandValidator()
        {
            RuleFor(c => c.CustomerCode)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Email)
                .NotEmpty()
                .EmailAddress()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.IP)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.ContactPersonFullName)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.CountryOfRegistration)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.CompanyName)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
