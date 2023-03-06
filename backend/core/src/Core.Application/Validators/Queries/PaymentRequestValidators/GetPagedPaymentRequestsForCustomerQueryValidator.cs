using Core.Application.Queries.PaymentRequestQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.PaymentRequestValidators
{
    public class GetPagedPaymentRequestsForCustomerQueryValidator : AbstractValidator<GetPagedPaymentRequestsForCustomerQuery>
    {
        public GetPagedPaymentRequestsForCustomerQueryValidator()
        {
            Include(new IPagedQueryValidator());
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
