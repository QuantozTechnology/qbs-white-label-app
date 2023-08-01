// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.TokenAggregate;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using Nexus.Token.SDK;
using Nexus.Token.SDK.Responses;

namespace Core.Infrastructure.Nexus.Repositories
{
    public class NexusTokenRepository : ITokenRepository
    {
        private readonly ITokenServer _tokenServer;

        private readonly TokenOptions _tokenSettings;

        public NexusTokenRepository(ITokenServer tokenServer,
            TokenOptions tokenSettings)
        {
            _tokenServer = tokenServer;
            _tokenSettings = tokenSettings;
        }

        public async Task<Paged<Token>> GetAsync(string publicKey, TokenAvailability? availability, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var accountCode = Helpers.ToNexusAccountCode(_tokenSettings.Blockchain, publicKey);

            var response = await _tokenServer.Accounts.GetBalances(accountCode);

            var userTokens = response.Balances!.Select(b => b.TokenCode);

            // get active tokens on Nexus
            var query = new Dictionary<string, string>()
            {
                { "type", "PeggedByAsset" },
                { "status", "Active" },
            };

            var nexusAssets = await _tokenServer.Tokens.Get(query);

            IEnumerable<Token> records;
            var tokens = new List<TokenResponse>();

            if (availability.HasValue)
            {
                if (availability == TokenAvailability.Available)
                {
                    var availableTokens = nexusAssets!.Records.Where(a => !userTokens!.Contains(a.Code))?.ToList();
                    records = availableTokens!.Select(ConvertToToken);
                }
                else if (availability == TokenAvailability.Owned)
                {
                    foreach (var balance in response.Balances)
                    {
                        var token = await _tokenServer.Tokens.Get(balance.TokenCode);
                        tokens.Add(token);
                    }
                    records = tokens!.Select(ConvertToToken);
                }
                else
                {
                    throw new ArgumentException("Invalid availability parameter. Please use 'available' or 'owned'.");
                }
            }
            else
            {
                // If availability is not specified, return all tokens
                records = nexusAssets.Records.Select(ConvertToToken);
            }

            var paginationHelper = new PaginationHelper<Token>();
            var pagedRecords = paginationHelper.GetPagedList(records, page, pageSize);

            return pagedRecords;
        }

        private static Token ConvertToToken(TokenResponse token)
        {
            return new Token
            {
                TokenCode = token.Code,
                Name = token.Name,
                IssuerAddress = token.IssuerAddress,
                Status = token.Status,
                Created = DateTimeOffset.Parse(token.Created)
            };
        }
    }
}
