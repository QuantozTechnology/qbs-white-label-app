using Core.Application.Commands;

namespace Core.Presentation.Models.Requests
{
    public class CreateWithdrawRequest
    {
        public required string TokenCode { get; set; }

        public decimal Amount { get; set; }

        public string? Memo { get; set; }

        public CreateWithdrawCommand ToCommand(string customerCode, string ip)
        {
            return new CreateWithdrawCommand
            {
                CustomerCode = customerCode,
                TokenCode = TokenCode,
                Amount = Amount,
                Memo = Memo,
                IP = ip
            };
        }
    }
}
