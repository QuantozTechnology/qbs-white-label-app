// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.MailAggregate;
using Core.Domain.Entities.SettingsAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Nexus.Token.SDK;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusMailsRepository : IMailsRepository
    {
        private readonly ITokenServer _tokenServer;

        public NexusMailsRepository(ITokenServer tokenServer)
        {
            _tokenServer = tokenServer;
        }

    //    public async Task<IEnumerable<Mail>> GetMailsAsync(string name, CancellationToken cancellationToken = default)
    //    {
    //        return null;
    ////        var query = new Dictionary<string, string>()
    ////        {
    ////            { "status", MailStatus.ReadyToSend.ToString()},
    ////        };

    ////        var response = await _tokenServer.Compliance.Mails.Get(query);

    ////        var mails = response.Records;

    ////        var items = new List<Mail>();

    ////        return mails
    ////.Select(b => new AccountBalance
    ////{
    ////    Balance = b.Amount,
    ////    TokenCode = b.TokenCode
    ////});

    ////        return new TrustLevel
    ////        {
    ////            FundingMothly = trustlevel.BuyLimits?.MonthlyLimit,
    ////            WithdrawMonthly = trustlevel.SellLimits?.MonthlyLimit,
    ////            Name = trustlevel.Name,
    ////            Description = trustlevel.Description
    ////        };
    //    }

        public Task<Mail> GetMailsAsync(string name, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult(true);
        }
    }
}
