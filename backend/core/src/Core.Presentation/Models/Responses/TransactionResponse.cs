// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.TransactionAggregate;

namespace Core.Presentation.Models.Responses
{
    public class TransactionResponse
    {
        public required string TransactionCode { get; set; }

        public string? FromAccountCode { get; set; }

        public string? ToAccountCode { get; set; }

        public string? SenderName { get; set; }

        public string? ReceiverName { get; set; }

        public required decimal Amount { get; set; }

        public required string TokenCode { get; set; }

        public long Created { get; set; }

        public required string Status { get; set; }

        public required string Type { get; set; }

        public string? Memo { get; set; }

        public required string Direction { get; set; }

        public static TransactionResponse FromTransaction(Transaction transaction)
        {
            return new TransactionResponse
            {
                FromAccountCode = transaction.FromAccountCode,
                ToAccountCode = transaction.ToAccountCode,
                Amount = transaction.Amount,
                Created = DateTimeProvider.ToUnixTimeInMilliseconds(transaction.Created),
                Direction = transaction.Direction,
                Status = transaction.Status,
                TokenCode = transaction.TokenCode,
                TransactionCode = transaction.TransactionCode,
                Memo = transaction.Memo,
                Type = transaction.Type,
                SenderName = transaction.Payment?.SenderName,
                ReceiverName = transaction.Payment?.ReceiverName,
            };
        }
    }
}
