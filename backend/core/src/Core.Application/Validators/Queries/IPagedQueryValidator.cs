using Core.Application;
using Core.Application.Queries.Interfaces;
using FluentValidation;

namespace Core.Application.Validators.Queries
{
    public class IPagedQueryValidator : AbstractValidator<IPagedQuery>
    {
        public IPagedQueryValidator()
        {
            RuleFor(c => c.PageSize).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
            RuleFor(c => c.Page).GreaterThan(0).WithErrorCode(ApplicationErrorCode.InvalidPropertyError.ToString());
        }
    }
}
