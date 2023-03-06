using Core.Application;
using Core.Application.Queries;
using FluentValidation;

namespace Core.Application.Validators.Queries
{
    public class GetPagedTransactionsQueryValidator : AbstractValidator<GetPagedTransactionsQuery>
    {
        public GetPagedTransactionsQueryValidator()
        {
            Include(new IPagedQueryValidator());
            RuleFor(c => c.CustomerCode).NotNull().NotEmpty().WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
