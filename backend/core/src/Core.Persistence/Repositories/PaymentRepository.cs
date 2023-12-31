﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Entities.TransactionAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Core.Persistence.Repositories
{
    public class PaymentRepository : Repository<Payment>, IPaymentRepository
    {
        public PaymentRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<Payment> GetByTransactionCodeAsync(string transactionCode, CancellationToken cancellationToken = default)
        {
            var payment = await Query().FirstOrDefaultAsync(pr => pr.TransactionCode == transactionCode, cancellationToken);

            if (payment == null)
            {
                throw new CustomErrorsException(PersistenceErrorCode.NotFoundError.ToString(), transactionCode,
                    "A payment was not found matching the provided transaction code.");
            }

            return payment;
        }

        public Task<bool> HasTransactionAsync(string transactionCode, CancellationToken cancellationToken = default)
        {
            return Query().AnyAsync(p => p.TransactionCode == transactionCode);
        }
    }
}
