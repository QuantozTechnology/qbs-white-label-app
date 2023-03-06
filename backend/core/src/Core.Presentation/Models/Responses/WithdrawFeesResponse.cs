using Core.Domain.Entities.TransactionAggregate;

namespace Core.Presentation.Models.Responses
{
    public class WithdrawFeesResponse
    {
        public required decimal? RequestedFiat { get; set; }

        public required FeeBreakdownResponse Fees { get; set; }

        public required decimal? ExecutedFiat { get; set; }

        public static WithdrawFeesResponse FromWithdrawFees(WithdrawFees withdrawFees)
        {
            return new WithdrawFeesResponse
            {
                RequestedFiat = withdrawFees.RequestedValueFiat,
                Fees = new FeeBreakdownResponse
                {
                    BankFeeFiat = withdrawFees.Fees.BankFeeFiat,
                    ServiceFeeFiat = withdrawFees.Fees.ServiceFeeFiat
                },
                ExecutedFiat = withdrawFees.ExecutedValueFiat
            };
        }
    }

    public class FeeBreakdownResponse
    {
        public decimal? BankFeeFiat { get; set; }

        public decimal? ServiceFeeFiat { get; set; }
    }
}
