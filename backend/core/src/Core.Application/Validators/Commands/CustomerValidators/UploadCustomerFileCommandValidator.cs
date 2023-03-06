using Core.Application;
using Core.Application.Commands.CustomerCommands;
using Core.Domain;
using FluentValidation;

namespace Core.Application.Validators.Commands.CustomerValidators
{
    public class UploadCustomerFileCommandValidator : AbstractValidator<UploadCustomerFileCommand>
    {
        public UploadCustomerFileCommandValidator()
        {
            RuleFor(c => c.CustomerCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.File).NotNull().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.FileType).NotEmpty().IsEnumName(typeof(FileType)).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
