using Core.Application;
using Core.Application.Commands;
using FluentValidation;

namespace Core.Application.Validators.Commands
{
    public class PayAccountCommandValidator : AbstractValidator<PayAccountCommand>
    {
        public PayAccountCommandValidator()
        {
            RuleFor(c => c.CustomerCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.ToAccountCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Amount).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.TokenCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Memo).NotEmpty().When(c => c.Memo != null).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
