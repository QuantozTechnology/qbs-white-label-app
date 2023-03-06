namespace Core.Domain.Entities.TransactionAggregate
{
    public class Transaction
    {
        public required string TransactionCode { get; set; }

        public string? FromAccountCode { get; set; }

        public string? ToAccountCode { get; set; }

        public required decimal Amount { get; set; }

        public required string TokenCode { get; set; }

        public required DateTimeOffset Created { get; set; }

        public required string Status { get; set; }

        public required string Type { get; set; }

        public string? Memo { get; set; }

        public required string Direction { get; set; }

        public Payment? Payment { get; set; }

        public Transaction()
        {

        }
    }
}
