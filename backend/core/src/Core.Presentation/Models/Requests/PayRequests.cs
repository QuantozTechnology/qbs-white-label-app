using Core.Application.Commands;
using System.ComponentModel.DataAnnotations;

namespace Core.Presentation.Models.Requests
{
    public class PayPaymentRequestRequest
    {
        [Required]
        public required string PaymentRequestCode { get; set; }

        public decimal? Amount { get; set; }

        public PayPaymentRequestCommand ToCommand(string customerCode, string ip)
        {
            return new PayPaymentRequestCommand
            {
                CustomerCode = customerCode,
                PaymentRequestCode = PaymentRequestCode,
                Amount = Amount,
                IP = ip
            };
        }
    }

    public class PayAccountRequest
    {
        [Required]
        public required string ToAccountCode { get; set; }

        [Required]
        public required string TokenCode { get; set; }

        public string? Memo { get; set; }

        public decimal Amount { get; set; }

        public PayAccountRequestOptions? Options { get; set; }

        public PayAccountCommand ToCommand(string customerCode, string ip)
        {
            return new PayAccountCommand
            {
                CustomerCode = customerCode,
                ToAccountCode = ToAccountCode,
                TokenCode = TokenCode,
                Memo = Memo,
                ShareName = Options?.ShareName,
                Amount = Amount,
                IP = ip
            };
        }
    }

    public class PayAccountRequestOptions
    {
        public bool? ShareName { get; set; } = false;
    }
}
