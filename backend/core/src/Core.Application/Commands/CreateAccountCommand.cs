using Core.Domain.Entities.AccountAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands
{
    public class CreateAccountCommand : IRequest
    {
        public string CustomerCode { get; set; }

        public CreateAccountCommand(string customerCode)
        {
            CustomerCode = customerCode;
        }
    }

    public class CreateAccountCommandHandler : IRequestHandler<CreateAccountCommand>
    {
        private readonly IAccountRepository _accountRepository;

        public CreateAccountCommandHandler(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<Unit> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        {
            var hasAccount = await _accountRepository.HasAccountAsync(request.CustomerCode, cancellationToken);

            if (hasAccount)
            {
                throw new CustomErrorsException(ApplicationErrorCode.ExistingPropertyError.ToString(), request.CustomerCode, "A customer can only have one account at the moment");
            }

            var account = Account.NewAccount(request.CustomerCode);

            await _accountRepository.CreateAsync(account, cancellationToken);

            return Unit.Value;
        }
    }
}
