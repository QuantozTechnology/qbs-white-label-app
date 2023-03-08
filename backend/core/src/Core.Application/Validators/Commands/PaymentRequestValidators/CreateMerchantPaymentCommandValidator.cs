using Core.Application.Commands.PaymentRequestCommands;
using FluentValidation;

namespace Core.Application.Validators.Commands.PaymentRequestValidators
{
    public class CreateMerchantPaymentCommandValidator : AbstractValidator<CreateMerchantPaymentRequestCommand>
    {
        public CreateMerchantPaymentCommandValidator()
        {
            Include(new CreatePaymentRequestCommandValidator());

            RuleFor(c => c.ReturnUrl)
                .NotEmpty()
                .Length(1, 100)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(c => c.CallbackUrl)
                .Length(1, 100)
                .When(c => c.CallbackUrl != null)
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());

            RuleFor(x => x.ReturnUrl)
                .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString())
                .WithMessage("The provided URL is invalid");

            RuleFor(x => x.CallbackUrl)
                .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
                .WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString())
                .When(c => c.CallbackUrl != null)
                .WithMessage("The provided URL is invalid");
        }
    }
}
