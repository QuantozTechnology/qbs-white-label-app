using System.Text.Json.Serialization;

namespace Web.SDK.Services.Models.Responses
{
    public class CustomerResponse
    {
        public required string Reference { get; set; }

        public required string TrustLevel { get; set; }

        public required string CurrencyCode { get; set; }

        public string? Email { get; set; }

        public required string Status { get; set; }

        public string? BankAccountNumber { get; set; }

        public required IDictionary<string, string> Data { get; set; }
    }
}
