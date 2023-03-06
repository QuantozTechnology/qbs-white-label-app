using Core.Domain.Entities.SettingsAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Nexus.Token.SDK;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusSettingsRepository : ISettingsRepository
    {
        private readonly ITokenServer _tokenServer;

        public NexusSettingsRepository(ITokenServer tokenServer)
        {
            _tokenServer = tokenServer;
        }

        public async Task<TrustLevel> GetTrustlevelAsync(string name, CancellationToken cancellationToken = default)
        {
            var query = new Dictionary<string, string>()
            {
                { "name", name },
            };

            var response = await _tokenServer.Compliance.Trustlevels.Get(query);

            var trustlevel = response.Records.FirstOrDefault();

            if (trustlevel == null)
            {
                throw new CustomErrorsException(NexusErrorCodes.TrustlevelNotFoundError.ToString(), name, "A trustlevel with the provided name was not found");
            }

            return new TrustLevel
            {
                FundingMothly = trustlevel.BuyLimits?.MonthlyLimit,
                WithdrawMonthly = trustlevel.SellLimits?.MonthlyLimit,
                Name = trustlevel.Name,
                Description = trustlevel.Description
            };
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }
    }
}
