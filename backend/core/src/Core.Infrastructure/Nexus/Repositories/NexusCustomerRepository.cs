// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Core.Infrastructure.AzureB2CGraphService;
using Core.Infrastructure.Nexus.SigningService;
using Nexus.Sdk.Shared.Requests;
using Nexus.Sdk.Token;
using Nexus.Sdk.Token.Requests;
using Nexus.Sdk.Token.Responses;
using Account = Core.Domain.Entities.AccountAggregate.Account;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusCustomerRepository : ICustomerRepository
    {
        private readonly ITokenServer _tokenServer;
        private readonly TokenOptions _tokenSettings;
        private readonly ISigningService _signingService;
        private readonly IB2CGraphService _b2cGraphService;

        public NexusCustomerRepository(
            ITokenServer tokenServer,
            TokenOptions tokenSettings,
            ISigningService signingService,
            IB2CGraphService b2CGraphService)
        {
            _tokenServer = tokenServer;
            _tokenSettings = tokenSettings;
            _signingService = signingService;
            _b2cGraphService = b2CGraphService;
        }

        public async Task CreateAsync(Customer customer, string? ip = null, CancellationToken cancellationToken = default)
        {
            var customerCodeExists = await _tokenServer.Customers.Exists(customer.CustomerCode);

            if (customerCodeExists)
            {
                throw new CustomErrorsException(NexusErrorCodes.ExistingProperty.ToString(), customer.CustomerCode, Constants.NexusErrorMessages.ExistingCode);
            }

            var encodedEmail = Uri.EscapeDataString(customer.Email.ToLower().Trim());

            var query = new Dictionary<string, string>
            {
                { "Email", encodedEmail }
            };

            var existingCustomersWithEmail = await _tokenServer.Customers.Get(query);

            if (existingCustomersWithEmail != null
                && existingCustomersWithEmail.Records.Any()
                && existingCustomersWithEmail.Records.Any(existingCustomer => existingCustomer.Status != CustomerStatus.DELETED.ToString()))
            {
                throw new CustomErrorsException(NexusErrorCodes.ExistingProperty.ToString(), customer.Email, Constants.NexusErrorMessages.ExistingEmail);
            }

            var success = Enum.TryParse<CustomerStatus>(customer.Status.ToString(), out var status);

            if (!success)
            {
                throw new CustomErrorsException(NexusErrorCodes.InvalidStatus.ToString(), customer.Status.ToString(), "Invalid customer status");
            }

            var builder = new CreateCustomerRequestBuilder(customer.CustomerCode, customer.TrustLevel, customer.CurrencyCode)
                .SetIsBusiness(customer.IsMerchant)
                .SetBankAccounts(
                [
                    new()
                    {
                        BankAccountName = customer.GetName(),
                        BankAccountNumber = null
                    }
                ])
                .SetEmail(customer.Email.ToLower().Trim())
                .SetStatus(status)
                .SetCustomData(customer.Data);

            await _tokenServer.Customers.Create(builder.Build(), ip);
        }

        public async Task UpdateAsync(Customer customer, CancellationToken cancellationToken = default)
        {
            var exists = await _tokenServer.Customers.Exists(customer.CustomerCode);

            if (!exists)
            {
                throw new CustomErrorsException(NexusErrorCodes.CustomerNotFoundError.ToString(), customer.CustomerCode, Constants.NexusErrorMessages.CustomerNotFound);
            }

            var success = Enum.TryParse<CustomerStatus>(customer.Status.ToString(), out var status);

            if (!success)
            {
                throw new CustomErrorsException(NexusErrorCodes.InvalidStatus.ToString(), customer.Status.ToString(), "Invalid customer status");
            }

            var builder = new UpdateCustomerRequestBuilder(customer.CustomerCode)
                .SetEmail(customer.Email.ToLower().Trim())
                .SetStatus(status)
                .SetCustomData(customer.Data);

            await _tokenServer.Customers.Update(builder.Build());
        }

        public async Task<Customer> GetAsync(string customerCode, CancellationToken cancellationToken = default)
        {
            var exists = await _tokenServer.Customers.Exists(customerCode);

            if (!exists)
            {
                throw new CustomErrorsException(NexusErrorCodes.CustomerNotFoundError.ToString(), customerCode, Constants.NexusErrorMessages.CustomerNotFound);
            }

            var customer = await _tokenServer.Customers.Get(customerCode);

            return new Customer
            {
                CustomerCode = customer.CustomerCode,
                Email = customer.Email!,
                Status = customer.Status,
                CurrencyCode = customer.CurrencyCode,
                TrustLevel = customer.TrustLevel,
                BankAccount = customer.BankAccount,
                IsMerchant = customer.IsBusiness,
                Data = customer.Data
            };
        }

        public async Task<IEnumerable<CustomerLimit>> GetLimitsAsync(string customerCode, CancellationToken cancellationToken = default)
        {
            var exists = await _tokenServer.Customers.Exists(customerCode);

            if (!exists)
            {
                throw new CustomErrorsException(NexusErrorCodes.CustomerNotFoundError.ToString(), customerCode, Constants.NexusErrorMessages.CustomerNotFound);
            }

            var limits = new List<CustomerLimit>();

            foreach (var token in _tokenSettings.CustomerTokens)
            {
                var fundingLimitsResponse = await _tokenServer.TokenLimits.GetFundingLimits(customerCode, token);

                var payoutLimitsResponse = await _tokenServer.TokenLimits.GetPayoutLimits(customerCode, token);

                var limit = ConvertToCustomerLimit(token, fundingLimitsResponse, payoutLimitsResponse);

                limits.Add(limit);
            }

            return limits;
        }

        public async Task DeleteAsync(Customer customer, string? ip = null, CancellationToken cancellationToken = default)
        {
            var customerCodeExists = await _tokenServer.Customers.Exists(customer.CustomerCode);

            if (!customerCodeExists)
            {
                throw new CustomErrorsException(NexusErrorCodes.CustomerNotFoundError.ToString(), customer.CustomerCode, Constants.NexusErrorMessages.CustomerNotFound);
            }

            // Check if the customer status is ACTIVE
            if (customer.Status != CustomerStatus.ACTIVE.ToString())
            {
                throw new CustomErrorsException(NexusErrorCodes.InvalidStatus.ToString(), customer.Status.ToString(), "Invalid customer status");
            }

            // Get Customer accounts
            var accounts = await _tokenServer.Accounts.Get(
                new Dictionary<string, string>
                {
                    { "CustomerCode", customer.CustomerCode },
                    { "Status", "ACTIVE" }
                });

            // Check if the customer has any accounts and balance
            if (accounts.Records.Any())
            {
                foreach (var acc in accounts.Records)
                {
                    Account account = new()
                    {
                        AccountCode = acc.AccountCode,
                        CustomerCode = acc.CustomerCode,
                        PublicKey = acc.PublicKey
                    };

                    // Get the account balance
                    var response = await _tokenServer.Accounts.GetBalances(account.AccountCode);

                    var accountBalances = response.Balances;

                    if (response.Balances.Any(balance => balance.Amount > 0))
                    {
                        throw new CustomErrorsException(NexusErrorCodes.NonZeroAccountBalance.ToString(), account.AccountCode, "Customer cannot be deleted due to non-zero balance");
                    }

                    if (accountBalances.Any())
                    {
                        // Get the token codes to be disabled
                        var tokensToBeDisabled = accountBalances.Select(b => b.TokenCode).ToArray();

                        await RemoveTrustlines(customer, account, tokensToBeDisabled);
                    }
                }
            }

            var deleteRequest = new DeleteCustomerRequest
            {
                CustomerCode = customer.CustomerCode
            };

            await _tokenServer.Customers.Delete(deleteRequest, ip);

            // delete user from azure b2c
            await _b2cGraphService.DeleteUserAsync(customer.CustomerCode);
        }

        private async Task RemoveTrustlines(Customer customer, Account account, string[]? tokensToBeDisabled = null)
        {
            var updateAccount = new UpdateTokenAccountRequest
            {
                Settings = new UpdateTokenAccountSettings
                {
                    AllowedTokens = new AllowedTokens
                    {
                        DisableTokens = tokensToBeDisabled
                    }
                }
            };

            var signableResponse = await _tokenServer.Accounts.Update(customer.CustomerCode, account.AccountCode, updateAccount);

            switch (_tokenSettings.Blockchain)
            {
                case Blockchain.STELLAR:
                    {
                        var submitRequest = await _signingService.SignStellarTransactionEnvelopeAsync(account.PublicKey, signableResponse);
                        await _tokenServer.Submit.OnStellarAsync(submitRequest);
                        break;
                    }
                case Blockchain.ALGORAND:
                    {
                        var submitRequest = await _signingService.SignAlgorandTransactionAsync(account.PublicKey, signableResponse);
                        await _tokenServer.Submit.OnAlgorandAsync(submitRequest);
                        break;
                    }
            }
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }

        private static CustomerLimit ConvertToCustomerLimit(string tokenCode, TokenLimitsResponse funding, TokenLimitsResponse payout)
        {
            var remainingFunding = funding?.Remaining;
            var totalFunding = funding?.Total;

            var remainingWithdraw = payout?.Remaining;
            var totalWithdraw = payout?.Total;

            var usedMonthlyFunding = totalFunding!.MonthlyLimit - remainingFunding!.MonthlyLimit;
            var usedMonthlyWithdraw = totalWithdraw!.MonthlyLimit - remainingWithdraw!.MonthlyLimit;

            var totalMonthlyFunding = totalFunding.MonthlyLimit;
            var totalMonthlyWithdraw = totalWithdraw.MonthlyLimit;

            return new CustomerLimit
            {
                TokenCode = tokenCode,
                Funding = new FundingLimit
                {
                    Limit = new Limit
                    {
                        Monthly = Math.Round(totalMonthlyFunding, 2)
                    },
                    Used = new Used
                    {
                        Monthly = Math.Round(usedMonthlyFunding, 2)
                    }
                },
                Withdraw = new WithdrawLimit
                {
                    Limit = new Limit
                    {
                        Monthly = Math.Round(totalMonthlyWithdraw, 2)
                    },
                    Used = new Used
                    {
                        Monthly = Math.Round(usedMonthlyWithdraw, 2)
                    }
                }
            };
        }
    }
}
