// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.CustomerCommands;
using Core.Domain;
using FluentValidation;

namespace Core.Application.Validators.Commands.CustomerValidators
{
    public class UploadCustomerFileCommandValidator : AbstractValidator<UploadCustomerFileCommand>
    {
        public UploadCustomerFileCommandValidator()
        {
            RuleFor(c => c.CustomerCode)
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.File)
                .NotNull()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.FileType)
                .NotEmpty()
                .IsEnumName(typeof(FileType)).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
