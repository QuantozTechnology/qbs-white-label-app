using Core.Application.Commands;
using FluentValidation;

namespace Core.Application.Validators.Commands
{
    public class PayPaymentRequestCommandValidator : AbstractValidator<PayPaymentRequestCommand>
    {
        public PayPaymentRequestCommandValidator()
        {
            RuleFor(c => c.CustomerCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.PaymentRequestCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Amount).GreaterThan(0).When(c => c.Amount != null).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
