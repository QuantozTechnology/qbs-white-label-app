using Core.Domain.Entities.CustomerAggregate;

namespace Core.Presentation.Models.Responses.CustomerResponses
{
    public class CustomerLimitResponse
    {
        public required string TokenCode { get; set; }

        public required Funding Funding { get; set; }

        public required Withdraw Withdraw { get; set; }

        public static CustomerLimitResponse FromCustomerLimit(CustomerLimit customerLimit)
        {
            return new CustomerLimitResponse
            {
                TokenCode = customerLimit.TokenCode,
                Funding = new Funding
                {
                    Limit = new Limit
                    {
                        Monthly = customerLimit.Funding.Limit.Monthly
                    },
                    Used = new Used
                    {
                        Monthly = customerLimit.Funding.Used.Monthly
                    }
                },
                Withdraw = new Withdraw
                {
                    Limit = new Limit
                    {
                        Monthly = customerLimit.Withdraw.Limit.Monthly
                    },
                    Used = new Used
                    {
                        Monthly = customerLimit.Withdraw.Used.Monthly
                    }
                }
            };
        }
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
