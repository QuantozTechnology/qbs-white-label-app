// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Abstractions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands
{
    public class CreateWithdrawCommand : IWithComplianceCheckCommand
    {
        public required string CustomerCode { get; set; }

        public required string TokenCode { get; set; }

        public decimal Amount { get; set; }

        public string? Memo { get; set; }

        public required string IP { get; set; }
    }

    public class CreateWithdrawCommandHandler : IRequestHandler<CreateWithdrawCommand>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICustomerRepository _customerRepository;

        public CreateWithdrawCommandHandler(ITransactionRepository transactionRepository,
            IAccountRepository accountRepository,
            ICustomerRepository customerRepository)
        {
            _transactionRepository = transactionRepository;
            _accountRepository = accountRepository;
            _customerRepository = customerRepository;
        }

        public async Task Handle(CreateWithdrawCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);
            var account = await _accountRepository.GetByCustomerCodeAsync(request.CustomerCode, cancellationToken);

            var withdraw = customer.NewWithdraw(account, request.TokenCode, request.Amount, request.Memo);

            await _transactionRepository.CreateWithdrawAsync(withdraw, request.IP, cancellationToken);
        }
    }
}
