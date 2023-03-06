using Core.Application.Queries;
using FluentValidation;

namespace Core.Application.Validators.Queries
{
    public class GetWithdrawFeesQueryValidator : AbstractValidator<GetWithdrawFeesQuery>
    {
        public GetWithdrawFeesQueryValidator()
        {
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.TokenCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Amount).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
