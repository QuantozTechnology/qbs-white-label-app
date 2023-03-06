namespace Web.SDK.Services.Models.Requests
{
    public class CreatePaymentRequestRequest
    {
        public required string TokenCode { get; set; }
        public required decimal Amount { get; set; }
        public PaymentRequestOptions? Options { get; set; }
    }

    public class PaymentRequestOptions
    {
        public bool? IsOneOffPayment { get; set; }
        public bool? PayerCanChangeRequestedAmount { get; set; }
        public long? ExpiresOn { get; set; }
        public bool? ShareName { get; set; }
        public string? Memo { get; set; }
        public IDictionary<string, string>? Params { get; set; }
    }

    public class CreateMerchantPaymentRequestCommand : CreatePaymentRequestRequest
    {
        public required MerchantSettings MerchantSettings { get; set; }
    }

    public class OptionsRequest
    {
        public long? ExpiresOn { get; set; }
        public bool? ShareName { get; set; }
        public string? Memo { get; set; }
        public IDictionary<string, string>? Params { get; set; }
    }

    public class MerchantSettings
    {
        public string? CallbackUrl { get; set; }
        public required string ReturnUrl { get; set; }
    }


}
