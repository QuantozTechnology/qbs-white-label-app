using System.Text.Json.Serialization;

namespace Core.Infrastructure.Compliance.IPLocator.Models
{
    public class ISPResponse
    {
        [JsonPropertyName("proxy")]
        public bool? IsVPN { get; set; }

        [JsonPropertyName("country")]
        public string? Country { get; set; }
    }
}
