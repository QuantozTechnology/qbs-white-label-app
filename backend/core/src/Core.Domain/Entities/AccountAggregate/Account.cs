namespace Core.Domain.Entities.AccountAggregate
{
    public class Account
    {
        public required string CustomerCode { get; set; }
        public required string AccountCode { get; set; }
        public required string PublicKey { get; set; }

        public Account()
        {
        }

        public static Account NewAccount(string customerCode)
        {
            return new Account
            {
                CustomerCode = customerCode,
                PublicKey = string.Empty,
                AccountCode = string.Empty
            };
        }
    }
}
