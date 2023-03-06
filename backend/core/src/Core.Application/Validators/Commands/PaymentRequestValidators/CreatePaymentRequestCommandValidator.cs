using Core.Application.Commands.PaymentRequestCommands;
using Core.Domain;
using FluentValidation;

namespace Core.Application.Validators.Commands.PaymentRequestValidators
{
    public class CreatePaymentRequestCommandValidator : AbstractValidator<CreatePaymentRequestCommand>
    {
        public CreatePaymentRequestCommandValidator()
        {
            RuleFor(c => c.CustomerCode).Length(1, 40).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.TokenCode).Length(1, 12).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Amount).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.Memo).Length(1, 28).When(c => c.Memo != null).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.ExpiresOn).GreaterThan(DateTimeProvider.UnixTimeInMilliseconds).When(c => c.ExpiresOn != null).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleForEach(c => c.Params!.Keys).NotEmpty().Length(1, 50).When(c => c.Params != null).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleForEach(c => c.Params!.Values).NotEmpty().Length(1, 50).When(c => c.Params != null).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
