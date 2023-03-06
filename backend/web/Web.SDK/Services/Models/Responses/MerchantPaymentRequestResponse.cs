namespace Web.SDK.Services.Models.Responses
{
    public class MerchantPaymentRequestResponse : PaymentRequestResponse
    {
        public required MerchantSettingsResponse MerchantSettings { get; set; }
    }

    public class MerchantSettingsResponse
    {
        public required string ReturnUrl { get; set; }
        public required string RedirectUrl { get; set; }
    }
}
