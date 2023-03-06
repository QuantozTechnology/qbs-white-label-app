using Core.Application.Queries.PaymentRequestQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.PaymentRequestValidators
{
    public class GetMerchantPaymentRequestQueryValidator : AbstractValidator<GetMerchantPaymentRequestQuery>
    {
        public GetMerchantPaymentRequestQueryValidator()
        {
            RuleFor(c => c.PaymentRequestCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
