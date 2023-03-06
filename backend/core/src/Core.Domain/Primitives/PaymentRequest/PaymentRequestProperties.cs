namespace Core.Domain.Primitives.PaymentRequest
{
    public class PaymentRequestProperties
    {
        public required string CustomerCode { get; set; }

        public required string PublicKey { get; set; }

        public required string TokenCode { get; set; }

        public decimal Amount { get; set; }

        public PaymentRequestOptions Options { get; set; } = new PaymentRequestOptions();
    }

    public class MerchantPaymentRequestProperties : PaymentRequestProperties
    {
        public required MerchantSettings MerchantSettings { get; set; }
    }
}
