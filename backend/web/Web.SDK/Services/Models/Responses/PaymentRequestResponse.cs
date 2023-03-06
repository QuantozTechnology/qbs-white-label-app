namespace Web.SDK.Services.Models.Responses
{
    public class PaymentRequestResponse
    {
        public required string Code { get; set; }

        public required string TokenCode { get; set; }

        public decimal RequestedAmount { get; set; }

        public required string Status { get; set; }

        public required long CreatedOn { get; set; }

        public long? UpdatedOn { get; set; }

        public PaymentRequestOptionsResponse? Options { get; set; }

        public IEnumerable<PaymentResponse>? Payments { get; set; }
    }

    public class PaymentRequestOptionsResponse
    {
        public long? ExpiresOn { get; set; }
        public string? Memo { get; set; }
        public string? Name { get; set; }
        public IDictionary<string, string>? Params { get; set; }
        public bool IsOneOffPayment { get; set; }
        public bool PayerCanChangeRequestAmount { get; set; }
    }
}