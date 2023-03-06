using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Nexus.SDK.Shared.Requests;
using Nexus.Token.SDK;
using Nexus.Token.SDK.Responses;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusCustomerRepository : ICustomerRepository
    {
        private readonly ITokenServer _tokenServer;
        private readonly TokenOptions _tokenSettings;

        public NexusCustomerRepository(ITokenServer tokenServer, TokenOptions tokenSettings)
        {
            _tokenServer = tokenServer;
            _tokenSettings = tokenSettings;
        }

        public async Task CreateAsync(Customer customer, string? ip = null, CancellationToken cancellationToken = default)
        {
            var exists = await _tokenServer.Customers.Exists(customer.CustomerCode);

            if (exists)
            {
                throw new CustomErrorsException(NexusErrorCodes.ExistingProperty.ToString(), customer.CustomerCode, Constants.NexusErrorMessages.ExistingProperty);
            }

            var success = Enum.TryParse<CustomerStatus>(customer.Status.ToString(), out var status);

            if (!success)
            {
                throw new CustomErrorsException(NexusErrorCodes.InvalidStatus.ToString(), customer.Status.ToString(), "Invalid customer status");
            }

            var builder = new CreateCustomerRequestBuilder(customer.CustomerCode, customer.TrustLevel, customer.CurrencyCode)
                .SetEmail(customer.Email)
                .SetStatus(status)
                .SetCustomData(customer.Data)
                .SetBusiness(customer.IsMerchant)
                .AddBankAccount(new CustomerBankAccountRequest { BankAccountName = customer.GetName(), BankAccountNumber = null });

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

            var builder = new UpdateCustomerRequestBuilder(customer.CustomerCode, customer.UpdateReason)
                .SetEmail(customer.Email)
                .SetStatus(status)
                .SetCustomData(customer.Data)
                .SetBusiness(customer.IsMerchant);

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
