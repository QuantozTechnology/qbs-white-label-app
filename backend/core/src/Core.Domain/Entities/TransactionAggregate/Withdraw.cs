namespace Core.Domain.Entities.TransactionAggregate
{
    public class Withdraw
    {
        public required string PublicKey { get; set; }
        public required string TokenCode { get; set; }
        public decimal Amount { get; set; }
        public string? Memo { get; set; }
    }
}
