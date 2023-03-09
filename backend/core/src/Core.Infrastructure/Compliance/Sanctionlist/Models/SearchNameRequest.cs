// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Text.Json.Serialization;

namespace Core.Infrastructure.Compliance.Sanctionlist.Models
{
    public class SearchNameRequest
    {
        [JsonPropertyName("lists")]
        public required string Lists { get; set; }

        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("referenceCode")]
        public required string ReferenceCode { get; set; }

        [JsonPropertyName("entityType")]
        public required string EntityType { get; set; }
    }
}
