// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.AccountAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Core.Infrastructure.Nexus.SigningService;
using Nexus.Token.SDK;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusAccountRepository : IAccountRepository
    {
        private readonly ISigningService _signingService;
        private readonly ITokenServer _tokenServer;

        private readonly TokenOptions _tokenSettings;

        public NexusAccountRepository(ISigningService signingService, ITokenServer tokenServer, TokenOptions tokenSettings)
        {
            _signingService = signingService;
            _tokenServer = tokenServer;
            _tokenSettings = tokenSettings;
        }

        public async Task CreateAsync(Account account, CancellationToken cancellationToken = default)
        {
            var exists = await _tokenServer.Customers.Exists(account.CustomerCode);

            if (!exists)
            {
                throw new CustomErrorsException(NexusErrorCodes.CustomerNotFoundError.ToString(), account.CustomerCode, Constants.NexusErrorMessages.CustomerNotFound);
            }

            var publicKey = await _signingService.GenerateKeyPair(_tokenSettings.Blockchain);

            switch (_tokenSettings.Blockchain)
            {
                case Blockchain.STELLAR:
                    await CreateStellarAccount(account.CustomerCode, publicKey);
                    break;

                case Blockchain.ALGORAND:
                    await CreateAlgorandAccount(account.CustomerCode, publicKey);
                    break;

                default:
                    throw new CustomErrorsException("NexusSDKError", _tokenSettings.Blockchain.ToString(), "Blockchain not supported");
            }
        }

        public async Task<bool> HasAccountAsync(string customerCode, CancellationToken cancellationToken = default)
        {
            var query = new Dictionary<string, string>()
            {
                { "customerCode", customerCode },
                { "status", "ACTIVE" }
            };

            var accounts = await _tokenServer.Accounts.Get(query);
            var account = accounts.Records.FirstOrDefault();

            return account != null;
        }

        public async Task<Account> GetByCustomerCodeAsync(string customerCode, CancellationToken cancellationToken = default)
        {
            var query = new Dictionary<string, string>()
            {
                { "customerCode", customerCode },
                { "status", "ACTIVE" }
            };

            var accounts = await _tokenServer.Accounts.Get(query);
            var account = accounts.Records.FirstOrDefault();

            if (account == null)
            {
                throw new CustomErrorsException(NexusErrorCodes.AccountNotFoundError.ToString(), customerCode, Constants.NexusErrorMessages.AccountNotFound);
            }

            return new Account
            {
                CustomerCode = account.CustomerCode,
                PublicKey = account.PublicKey,
                AccountCode = account.AccountCode
            };
        }

        public async Task<Account> GetByAccountCodeAsync(string accountCode, CancellationToken cancellationToken = default)
        {
            var account = await _tokenServer.Accounts.Get(accountCode);

            if (account == null)
            {
                throw new CustomErrorsException(NexusErrorCodes.AccountNotFoundError.ToString(), accountCode, Constants.NexusErrorMessages.AccountNotFound);
            }

            return new Account
            {
                CustomerCode = account.CustomerCode,
                PublicKey = account.PublicKey,
                AccountCode = account.AccountCode
            };
        }

        public async Task<IEnumerable<AccountBalance>> GetBalancesAsync(string publicKey, CancellationToken cancellationToken = default)
        {
            var accountCode = Helpers.ToNexusAccountCode(_tokenSettings.Blockchain, publicKey);
            var response = await _tokenServer.Accounts.GetBalances(accountCode);

            return response.Balances
                .Select(b => new AccountBalance
                {
                    Balance = b.Amount,
                    TokenCode = b.TokenCode
                });
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }

        private async Task CreateStellarAccount(string customerCode, string publicKey)
        {
            var signableResponse = await _tokenServer.Accounts.CreateOnStellarAsync(customerCode, publicKey, _tokenSettings.CustomerTokens!);
            var submitRequest = await _signingService.SignStellarTransactionEnvelopeAsync(publicKey, signableResponse);

            await _tokenServer.Submit.OnStellarAsync(submitRequest);
        }

        private async Task CreateAlgorandAccount(string customerCode, string publicKey)
        {
            var signableResponse = await _tokenServer.Accounts.CreateOnAlgorandAsync(customerCode, publicKey, _tokenSettings.CustomerTokens!);
            var submitRequest = await _signingService.SignAlgorandTransactionAsync(publicKey, signableResponse);

            await _tokenServer.Submit.OnAlgorandAsync(submitRequest!);
        }
    }
}
