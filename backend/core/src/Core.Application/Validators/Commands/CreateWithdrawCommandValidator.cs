using Core.Application;
using Core.Application.Commands;
using FluentValidation;

namespace Core.Application.Validators.Commands
{
    public class CreateWithdrawCommandValidator : AbstractValidator<CreateWithdrawCommand>
    {
        public CreateWithdrawCommandValidator()
        {
            RuleFor(c => c.CustomerCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.TokenCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Memo).NotEmpty().When(c => c.Memo != null).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Amount).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
