namespace Core.Domain.Primitives.PaymentRequest
{
    public class MerchantSettings
    {
        public string? CallbackUrl { get; set; }
        public string ReturnUrl { get; set; }

        public MerchantSettings(string returnUrl)
        {
            ReturnUrl = returnUrl;
        }
    }
}
