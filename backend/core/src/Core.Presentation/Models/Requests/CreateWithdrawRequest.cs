// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
