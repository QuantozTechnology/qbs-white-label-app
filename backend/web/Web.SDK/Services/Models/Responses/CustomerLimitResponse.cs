namespace Web.SDK.Services.Models.Responses
{
    public class CustomerLimitResponse
    {
        public required string TokenCode { get; set; }

        public required Funding Funding { get; set; }

        public required Withdraw Withdraw { get; set; }
    }

    public class Funding
    {
        public required Used Used { get; set; }

        public required Limit Limit { get; set; }
    }

    public class Withdraw
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
