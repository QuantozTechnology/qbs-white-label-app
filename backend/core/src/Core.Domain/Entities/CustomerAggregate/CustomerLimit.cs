namespace Core.Domain.Entities.CustomerAggregate
{
    public class CustomerLimit
    {
        public required string TokenCode { get; set; }

        public required FundingLimit Funding { get; set; }

        public required WithdrawLimit Withdraw { get; set; }
    }

    public class FundingLimit
    {
        public required Used Used { get; set; }

        public required Limit Limit { get; set; }
    }

    public class WithdrawLimit
    {
        public required Used Used { get; set; }

        public required Limit Limit { get; set; }
    }

    public class Used
    {
        public required decimal Monthly { get; set; }
    }

    public class Limit
    {
        public required decimal Monthly { get; set; }
    }
}
