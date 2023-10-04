// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.CustomerCommands;
using FluentValidation;

namespace Core.Application.Validators.Commands.CustomerValidators
{
    public class DeviceAuthenticationCommandValidator : AbstractValidator<DeviceAuthenticationCommand>
    {
        public DeviceAuthenticationCommandValidator()
        {
            RuleFor(c => c.CustomerCode)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.PublicKey)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.IP)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
