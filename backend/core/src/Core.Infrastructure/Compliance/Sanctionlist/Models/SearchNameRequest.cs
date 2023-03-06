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
