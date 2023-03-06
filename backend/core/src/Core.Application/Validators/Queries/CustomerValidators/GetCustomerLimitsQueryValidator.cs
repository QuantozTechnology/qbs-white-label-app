using Core.Application.Queries.CustomerQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.CustomerValidators
{
    public class GetCustomerLimitsQueryValidator : AbstractValidator<GetCustomerLimitsQuery>
    {
        public GetCustomerLimitsQueryValidator()
        {
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
