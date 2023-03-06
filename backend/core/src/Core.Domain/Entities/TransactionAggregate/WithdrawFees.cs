namespace Core.Domain.Entities.TransactionAggregate
{
    public class WithdrawFees
    {
        public required decimal? RequestedValueFiat { get; set; }

        public required FeeBreakdown Fees;

        public required decimal? ExecutedValueFiat { get; set; }
    }

    public class FeeBreakdown
    {
        public decimal? BankFeeFiat { get; set; }

        public decimal? ServiceFeeFiat { get; set; }
    }
}
