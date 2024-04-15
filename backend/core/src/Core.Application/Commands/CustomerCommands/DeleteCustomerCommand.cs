// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Entities.AccountAggregate;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.CustomerCommands
{
    public class DeleteCustomerCommand : IRequest
    {
        public required string CustomerCode { get; set; }

        public DeleteCustomerCommand(string customerCode)
        {
            CustomerCode = customerCode;
        }
    }

    public class DeleteCustomerCommandHandler : IRequestHandler<DeleteCustomerCommand>
    {
        //private readonly IAccountRepository _accountRepository;

        //public CreateAccountCommandHandler(IAccountRepository accountRepository)
        //{
        //    _accountRepository = accountRepository;
        //}

        //public async Task Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        //{
        //    var hasAccount = await _accountRepository.HasAccountAsync(request.CustomerCode, cancellationToken);

        //    if (hasAccount)
        //    {
        //        throw new CustomErrorsException(ApplicationErrorCode.ExistingPropertyError.ToString(), request.CustomerCode, "A customer can only have one account at the moment");
        //    }

        //    var account = Account.NewAccount(request.CustomerCode);

        //    await _accountRepository.CreateAsync(account, cancellationToken);
        //}

        private readonly ICustomerRepository _customerRepository;

        public DeleteCustomerCommandHandler(
            ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
        {
            // get the customer
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);

            await _customerRepository.CreateAsync(customer, request.IP);
        }
    }
}
