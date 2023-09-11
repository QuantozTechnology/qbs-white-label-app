// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.OfferCommands;
using Core.Domain;
using FluentValidation;

namespace Core.Application.Validators.Commands.OfferRequestValidators
{
    public class CreateOfferRequestCommandValidator : AbstractValidator<CreateOfferRequestCommand>
    {
        public CreateOfferRequestCommandValidator()
        {
            RuleFor(c => c.OfferAction)
                .IsInEnum()
                .WithMessage("Invalid value for OfferAction.")
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.CustomerCode)
                .NotNull()
                .Length(1, 40)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.SourceTokenCode)
                .NotNull()
                .Length(1, 12)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.SourceTokenAmount)
                .GreaterThan(0)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.DestinationTokenCode)
                .NotNull()
                .Length(1, 12)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.DestinationTokenAmount)
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
