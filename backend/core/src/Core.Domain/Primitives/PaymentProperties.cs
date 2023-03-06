namespace Core.Domain.Primitives
{
    public class PaymentProperties
    {
        public required string SenderPublicKey { get; set; }
        public required string ReceiverPublicKey { get; set; }
        public string? Name { get; set; }
        public required string TokenCode { get; set; }
        public decimal Amount { get; set; }
        public string? Memo { get; set; }
        public int? PaymentRequestId { get; set; }
    }
}
