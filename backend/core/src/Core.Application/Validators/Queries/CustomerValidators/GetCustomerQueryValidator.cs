using Core.Application;
using Core.Application.Queries.CustomerQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.CustomerValidators
{
    public class GetCustomerQueryValidator : AbstractValidator<GetCustomerQuery>
    {
        public GetCustomerQueryValidator()
        {
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
