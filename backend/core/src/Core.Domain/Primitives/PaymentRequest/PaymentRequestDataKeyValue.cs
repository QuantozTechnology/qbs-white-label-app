namespace Core.Domain.Primitives.PaymentRequest
{
    public class PaymentRequestParams
    {
        public PaymentRequestParams(string key, string value)
        {
            Key = key;
            Value = value;
        }

        public string Key { get; set; }

        public string Value { get; set; }
    }
}
