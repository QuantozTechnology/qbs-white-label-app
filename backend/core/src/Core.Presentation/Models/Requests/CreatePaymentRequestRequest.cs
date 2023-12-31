﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.PaymentRequestCommands;
using System.ComponentModel.DataAnnotations;

namespace Core.Presentation.Models.Requests
{
    public class CreatePaymentRequestRequest
    {
        public required string TokenCode { get; set; }

        public required decimal Amount { get; set; }

        public OptionsRequest? Options { get; set; }

        public CreatePaymentRequestCommand ToCommand(string customerCode)
        {
            return new CreatePaymentRequestCommand
            {
                CustomerCode = customerCode,
                Amount = Amount,
                TokenCode = TokenCode,
                Memo = Options?.Memo,
                ExpiresOn = Options?.ExpiresOn,
                ShareName = Options?.ShareName,
                IsOneOffPayment = Options?.IsOneOffPayment,
                PayerCanChangeRequestedAmount = Options?.PayerCanChangeRequestedAmount,
                Params = Options?.Params
            };
        }
    }

    public class CreateMerchantPaymentRequestRequest : CreatePaymentRequestRequest
    {
        [Required]
        public required string AccountCode { get; set; }

        [Required]
        public required MerchantSettingsRequest MerchantSettings { get; set; }

        public CreateMerchantPaymentRequestCommand ToCommand()
        {
            return new CreateMerchantPaymentRequestCommand
            {
                AccountCode = AccountCode,
                Amount = Amount,
                TokenCode = TokenCode,
                Memo = Options?.Memo,
                ExpiresOn = Options?.ExpiresOn,
                ShareName = Options?.ShareName,
                Params = Options?.Params,
                CallbackUrl = MerchantSettings.CallbackUrl,
                IsOneOffPayment = Options?.IsOneOffPayment,
                PayerCanChangeRequestedAmount = Options?.PayerCanChangeRequestedAmount,
                ReturnUrl = MerchantSettings.ReturnUrl
            };
        }
    }

    public class OptionsRequest
    {
        public long? ExpiresOn { get; set; }
        public bool? ShareName { get; set; }
        public string? Memo { get; set; }
        public bool? IsOneOffPayment { get; set; }
        public bool? PayerCanChangeRequestedAmount { get; set; }
        public IDictionary<string, string>? Params { get; set; }
    }

    public class MerchantSettingsRequest
    {
        public string? CallbackUrl { get; set; }
        public required string ReturnUrl { get; set; }
    }
}
