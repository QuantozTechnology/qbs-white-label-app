using Core.Application.Abstractions;
using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Pipelines
{
    public class ComplianceBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IWithComplianceCheckCommand<TResponse>
    {
        private readonly IComplianceService _compliance;
        private readonly ICustomerRepository _customerRepository;

        public ComplianceBehaviour(IComplianceService compliance,
            ICustomerRepository customerRepository)
        {
            _compliance = compliance;
            _customerRepository = customerRepository;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var complianceCheck = await _compliance.CheckAsync(customer, request.IP, cancellationToken);

            if (!complianceCheck.HasPassed)
            {
                switch (complianceCheck.Result)
                {
                    case ComplianceCheckResult.UsingVPN:
                        customer.IsUsingVPN(complianceCheck.FailedPropertyName);
                        break;

                    case ComplianceCheckResult.CountryIsBlacklisted:
                        customer.IsExecutingTransactionInBlacklistedCountryAsync(complianceCheck.FailedPropertyName);
                        break;

                    case ComplianceCheckResult.Sanctioned:
                        customer.IsExecutingTransactionWhileSanctionAsync(complianceCheck.FailedPropertyName);
                        break;
                }

                await _customerRepository.UpdateAsync(customer, cancellationToken);
            }

            return await next();
        }
    }
}
