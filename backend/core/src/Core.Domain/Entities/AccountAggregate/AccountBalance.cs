namespace Core.Domain.Entities.AccountAggregate
{
    public class AccountBalance
    {
        public required string TokenCode { get; set; }
        public required decimal Balance { get; set; }
    }
}
