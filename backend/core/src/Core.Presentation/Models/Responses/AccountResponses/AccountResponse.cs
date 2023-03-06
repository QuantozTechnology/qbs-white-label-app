using Core.Domain.Entities.AccountAggregate;

namespace Core.Presentation.Models.Responses.AccountResponses
{
    public class AccountResponse
    {
        public required string PublicAddress { get; set; }

        public required string AccountCode { get; set; }

        public static AccountResponse FromAccount(Account account)
        {
            return new AccountResponse
            {
                PublicAddress = account.PublicKey,
                AccountCode = account.AccountCode
            };
        }
    }
}
