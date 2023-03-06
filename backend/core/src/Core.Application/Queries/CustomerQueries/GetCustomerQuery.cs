using Core.Domain;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.CustomerQueries
{
    public class GetCustomerQuery : IRequest<Customer>
    {
        public string CustomerCode { get; set; }

        public GetCustomerQuery(string customerCode)
        {
            CustomerCode = customerCode;
        }
    }

    public class GetCustomerQueryHandler : IRequestHandler<GetCustomerQuery, Customer>
    {
        private readonly ICustomerRepository _customerRepository;

        public GetCustomerQueryHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Customer> Handle(GetCustomerQuery request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode);

            if (customer.Status != CustomerStatus.ACTIVE.ToString() && customer.Status != CustomerStatus.UNDERREVIEW.ToString())
            {
                throw new CustomErrorsException(ApplicationErrorCode.InvalidStatusError.ToString(), request.CustomerCode, "Customer status with this reference is not valid");
            }

            return customer;
        }
    }
}
