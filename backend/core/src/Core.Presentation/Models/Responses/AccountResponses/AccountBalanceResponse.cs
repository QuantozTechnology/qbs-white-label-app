using Core.Domain.Entities.AccountAggregate;

namespace Core.Presentation.Models.Responses.AccountResponses
{
    public class AccountBalanceResponse
    {
        public required string TokenCode { get; set; }

        public required decimal Balance { get; set; }

        public static AccountBalanceResponse FromAccountBalance(AccountBalance accountBalance)
        {
            return new AccountBalanceResponse
            {
                Balance = accountBalance.Balance,
                TokenCode = accountBalance.TokenCode
            };
        }
    }
}
