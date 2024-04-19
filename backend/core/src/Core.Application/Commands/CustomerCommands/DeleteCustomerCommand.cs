// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.CustomerCommands
{
    public class DeleteCustomerCommand : IRequest
    {
        public string CustomerCode { get; set; }

        public string IP { get; set; }

        public DeleteCustomerCommand(string customerCode, string iP)
        {
            CustomerCode = customerCode;
            IP = iP;
        }
    }

    public class DeleteCustomerCommandHandler : IRequestHandler<DeleteCustomerCommand>
    {
        private readonly ICustomerRepository _customerRepository;

        public DeleteCustomerCommandHandler(
            ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);

            await _customerRepository.DeleteAsync(customer, request.IP);
        }
    }
}
