namespace Web.SDK.Services.Models.Responses
{
    public class PaymentResponse
    {
        public string? TransactionCode { get; set; }
        public decimal Amount { get; set; }
        public long CreatedOn { get; set; }
        public long? UpdatedOn { get; set; }
    }
}
