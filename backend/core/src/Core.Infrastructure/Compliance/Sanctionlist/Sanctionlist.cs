// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Infrastructure.Compliance.Sanctionlist.Models;
using System.Net.Http.Json;
using System.Text.Json;

namespace Core.Infrastructure.Compliance.Sanctionlist
{
    public class Sanctionlist : ISanctionlist
    {
        private readonly HttpClient _client;
        private readonly SanctionlistOptions _settings;

        public Sanctionlist(HttpClient client, SanctionlistOptions settings)
        {
            _client = client;
            _settings = settings;
        }

        public Task<bool> IsPersonSanctioned(string customerCode, string name)
        {
            return IsSanctionedAsync(customerCode, name, "Person");
        }

        public Task<bool> IsEnterpriseSanctioned(string customerCode, string name)
        {
            return IsSanctionedAsync(customerCode, name, "Enterprise");
        }

        private async Task<bool> IsSanctionedAsync(string customerCode, string name, string entity)
        {
            var maximumScore = _settings.MaximumSanctionlistScore;
            var sanctionlists = _settings.Sanctionlists;

            if (maximumScore.HasValue && !string.IsNullOrWhiteSpace(sanctionlists))
            {
                var score = await GetMaxSimilarityScore(customerCode, sanctionlists, name, entity);

                if (score.HasValue && score > maximumScore)
                {
                    return true;
                }
            }

            return false;
        }

        private async Task<decimal?> GetMaxSimilarityScore(string list, string customerCode, string name, string entity)
        {
            var response = await SearchName(customerCode, list, name, entity);

            return response.ListResults?.Values
                .Where(v => v.SearchResults != null)
                .Select(v => v.SearchResults)
                .SelectMany(sr => sr!)
                .Max(sr => sr.MaxSimilarityScore);
        }

        private async Task<SearchNameResponse> SearchName(string list, string customerCode, string name, string entity)
        {
            var request = new SearchNameRequest
            {
                Lists = list,
                Name = name,
                ReferenceCode = customerCode,
                EntityType = entity,
            };

            var apiResponse = await _client.PostAsJsonAsync("names/search", request);
            var json = await apiResponse.Content.ReadAsStringAsync();

            if (!apiResponse.IsSuccessStatusCode)
            {
                throw new CustomErrorsException("SanctionlistError", name, "An error occured getting information on the name");
            }

            var response = JsonSerializer.Deserialize<SearchNameResponse>(json);

            if (response == null)
            {
                throw new CustomErrorsException("SanctionlistError", name, "An error occured getting information on the name");
            }

            return response;
        }
    }
}
