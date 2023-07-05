// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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

    public class ConfirmOfferRequest
    {
        [Required]
        public required string OfferCode { get; set; }

        [Required]
        public required decimal Amount { get; set; }

        public ConfirmOfferPaymentCommand ToCommand(string customerCode, string ip)
        {
            return new ConfirmOfferPaymentCommand
            {
                CustomerCode = customerCode,
                PaymentRequestCode = PaymentRequestCode,
                Amount = Amount,
                IP = ip
            };
        }
    }
}
