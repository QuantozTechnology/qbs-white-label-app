namespace Web.SDK.Services.Models.Responses
{
    public class AccountBalanceResponse
    {
        public required string TokenCode { get; set; }

        public required decimal Balance { get; set; }
    }
}
