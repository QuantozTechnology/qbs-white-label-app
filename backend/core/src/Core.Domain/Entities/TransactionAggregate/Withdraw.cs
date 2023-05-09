// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Events;
using Core.Domain.Primitives;

namespace Core.Domain.Entities.TransactionAggregate
{
    public class Withdraw : Entity
    {
        public required string PublicKey { get; set; }
        public required string TokenCode { get; set; }
        public decimal Amount { get; set; }
        public string? Memo { get; set; }

        public static Withdraw Create(string publicKey, string tokenCode, decimal amount, Customer customer, string? memo = null)
        {
            var withdrawal = new Withdraw
            {
                PublicKey = publicKey,
                TokenCode = tokenCode,
                Amount = amount,
                Memo = memo
            };

            withdrawal.RaiseDomainEvent(new WithdrawalCreatedEvent(withdrawal, customer));

            return withdrawal;
        }
    }
}
