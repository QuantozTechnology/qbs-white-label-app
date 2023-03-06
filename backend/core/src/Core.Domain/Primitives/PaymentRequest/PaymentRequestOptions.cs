namespace Core.Domain.Primitives.PaymentRequest
{
    public class PaymentRequestOptions
    {
        public bool IsOneOffPayment { get; set; } = false;
        public bool PayerCanChangeRequestedAmount { get; set; } = true;
        public DateTimeOffset? ExpiresOn { get; set; }
        public string? Memo { get; set; }
        public string? Name { get; set; }
        public ICollection<PaymentRequestParams>? Params { get; set; } = new List<PaymentRequestParams>();

    }
}
