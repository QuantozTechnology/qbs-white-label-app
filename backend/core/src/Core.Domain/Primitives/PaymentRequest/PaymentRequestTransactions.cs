namespace Core.Domain.Primitives.PaymentRequest
{
    public class PaymentRequestTransactions
    {
        public required string TransactionCode { get; set; }

        public decimal PaidAmount { get; set; }
    }
}
