// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Queries.CustomerQueries
{
    public class GetCustomerLimitsQuery : IRequest<IEnumerable<CustomerLimit>>
    {
        public string CustomerCode { get; set; }

        public GetCustomerLimitsQuery(string customerCode)
        {
            CustomerCode = customerCode;
        }
    }

    public class GetCustomerLimitsQueryHandler : IRequestHandler<GetCustomerLimitsQuery, IEnumerable<CustomerLimit>>
    {
        private readonly ICustomerRepository _customerRepository;

        public GetCustomerLimitsQueryHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<IEnumerable<CustomerLimit>> Handle(GetCustomerLimitsQuery request, CancellationToken cancellationToken)
        {
            return await _customerRepository.GetLimitsAsync(request.CustomerCode);
        }
    }
}
