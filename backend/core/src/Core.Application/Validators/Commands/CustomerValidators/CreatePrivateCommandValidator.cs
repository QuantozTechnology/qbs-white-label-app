using Core.Application.Commands.CustomerCommands;
using FluentValidation;

namespace Core.Application.Validators.Commands.CustomerValidators
{
    public class CreatePrivateCommandValidator : AbstractValidator<CreatePrivateCommand>
    {
        public CreatePrivateCommandValidator()
        {
            RuleFor(c => c.CustomerCode)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Email)
                .NotNull()
                .NotEmpty()
                .EmailAddress()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.IP)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.FirstName)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.LastName)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.DateOfBirth)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.CountryOfResidence)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Phone)
                .NotNull()
                .NotEmpty()
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
