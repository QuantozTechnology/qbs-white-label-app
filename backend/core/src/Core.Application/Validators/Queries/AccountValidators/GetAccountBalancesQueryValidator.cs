using Core.Application;
using Core.Application.Queries.AccountQueries;
using FluentValidation;

namespace Core.Application.Validators.Queries.AccountValidators
{
    public class GetAccountBalancesQueryValidator : AbstractValidator<GetAccountBalancesQuery>
    {
        public GetAccountBalancesQueryValidator()
        {
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
