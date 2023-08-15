// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.TokenAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using Nexus.Token.SDK;
using Nexus.Token.SDK.Responses;
using TaxonomyResponse = Core.Domain.Entities.TokenAggregate.TaxonomyResponse;

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

            Token[] records;

            if (availability.HasValue)
            {
                if (availability == TokenAvailability.Available)
                {
                    var availableTokens = nexusAssets!.Records.Where(a => !userTokens!.Contains(a.Code))?.ToList();

                    records = new Token[availableTokens!.Count];

                    var tasks = availableTokens.Select((at, index) =>
                    {
                        return Task.Run(() =>
                        {
                            records[index] = ConvertTokenResponseToToken(at);
                        });
                    });

                    await Task.WhenAll(tasks);
                }
                else if (availability == TokenAvailability.Owned)
                {
                    var tokens = new List<TokenResponse>();

                    foreach (var balance in response.Balances)
                    {
                        var codeQuery = new Dictionary<string, string>()
                        {
                            { "code", balance.TokenCode }
                        };

                        var token = await _tokenServer.Tokens.Get(codeQuery);

                        tokens.Add(token.Records.FirstOrDefault()!);
                    }

                    records = new Token[tokens!.Count];

                    var tasks = tokens
                        .Join(response.Balances,
                        token => token.Code,
                        balance => balance.TokenCode,
                        (token, balance) =>
                        {
                            return new
                            {
                                Token = token,
                                Balance = balance.Amount,
                            };
                        })
                        .Select((token, index) =>
                        {
                            return Task.Run(() =>
                            {
                                records[index] = ConvertTokenResponseToToken(token.Token, token.Balance);
                            });
                        });

                    await Task.WhenAll(tasks);
                }
                else
                {
                    throw new ArgumentException("Invalid availability parameter. Please use 'available' or 'owned'.");
                }
            }
            else
            {
                // If availability is not specified, return nexusAssets converted into Token
                records = new Token[nexusAssets!.Records!.Count()];
                var tasks = nexusAssets.Records.Select((asset, index) =>
                {
                    return Task.Run(() =>
                    {
                        records[index] = ConvertTokenResponseToToken(asset);
                    });
                });

                await Task.WhenAll(tasks);
            }

            var paginationHelper = new PaginationHelper<Token>();
            var pagedRecords = paginationHelper.GetPagedList(records, page, pageSize);

            return pagedRecords;
        }

        public async Task<TokenTaxonomy> GetTokenDetailsAsync(string code, CancellationToken cancellationToken = default)
        {
            var token = await _tokenServer.Tokens.Get(code);

            return token == null
                ? throw new CustomErrorsException(NexusErrorCodes.TokenNotFoundError.ToString(), code, "A token with the provided code was not found")
                : ConvertTokenDetailsResponseToToken(token);
        }

        private static Token ConvertTokenResponseToToken(TokenResponse token, decimal? balance = null)
        {
            return new Token
            {
                TokenCode = token.Code,
                Name = token.Name,
                IssuerAddress = token.IssuerAddress,
                Balance = balance?.ToString() ?? null,
                Status = token.Status,
                Created = DateTimeOffset.Parse(token.Created)
            };
        }

        private static TokenTaxonomy ConvertTokenDetailsResponseToToken(TokenDetailsResponse token, decimal? balance = null)
        {
            return new TokenTaxonomy
            {
                TokenCode = token.Code,
                Name = token.Name,
                IssuerAddress = token.IssuerAddress,
                Balance = balance?.ToString() ?? null,
                Status = token.Status,
                Created = DateTimeOffset.Parse(token.Created),
                BlockchainId = token?.BlockchainId,
                Data = token?.Data,
                Taxonomy = token?.Taxonomy != null ? new TaxonomyResponse
                {
                    TaxonomySchemaCode = token?.Taxonomy?.TaxonomySchemaCode,
                    AssetUrl = token?.Taxonomy?.AssetUrl,
                    Hash = token?.Taxonomy?.Hash,
                    TaxonomyProperties = token?.Taxonomy?.TaxonomyProperties
                } : null
            };
        }
    }
}
