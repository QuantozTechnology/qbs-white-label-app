// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Text.Json.Serialization;

namespace Core.Infrastructure.Compliance.Sanctionlist.Models
{
    public class GetSearchResultListItemAkaResponse
    {
        [JsonPropertyName("aliasId")]
        public string? AliasId { get; set; }

        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [JsonPropertyName("middleName")]
        public string? MiddleName { get; set; }

        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }

        [JsonPropertyName("wholeName")]
        public string? WholeName { get; set; }
    }

    public class GetSearchResultListItemResponse
    {
        [JsonPropertyName("searchScore")]
        public double? SearchScore { get; set; }

        [JsonPropertyName("maxSimilarityScore")]
        public decimal? MaxSimilarityScore { get; set; }

        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [JsonPropertyName("middleName")]
        public string? MiddleName { get; set; }

        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }

        [JsonPropertyName("wholeName")]
        public string? WholeName { get; set; }

        [JsonPropertyName("aliases")]
        public IEnumerable<GetSearchResultListItemAkaResponse>? Aliases { get; set; }
    }

    public class GetSearchResultListResponse
    {
        [JsonPropertyName("version")]
        public string? Version { get; set; }
        [JsonPropertyName("created")]
        public DateTime Created { get; set; }
        [JsonPropertyName("searchResults")]
        public IEnumerable<GetSearchResultListItemResponse>? SearchResults { get; set; }
    }


    public class SearchNameResponse
    {
        [JsonPropertyName("listResults")]
        public Dictionary<string, GetSearchResultListResponse>? ListResults { get; set; }
    }

}
