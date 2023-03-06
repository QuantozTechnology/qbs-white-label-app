using Core.Application.Queries.PaymentRequestQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.PaymentRequestValidators
{
    public class GetPaymentRequestQueryValidator : AbstractValidator<GetPaymentRequestQuery>
    {
        public GetPaymentRequestQueryValidator()
        {
            RuleFor(c => c.PaymentRequestCode).NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
