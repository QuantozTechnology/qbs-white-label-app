﻿// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Entities.PaymentRequestAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Core.Persistence.Repositories
{
    public class PaymentRequestRepository : Repository<PaymentRequest>, IPaymentRequestRepository
    {
        public PaymentRequestRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<Paged<PaymentRequest>> GetAllForCustomerAsync(string customerCode, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paymentRequests = Query()
                .Include(pr => pr.Payments)
                .Where(pr => pr.CustomerCode == customerCode);

            var items = await paymentRequests
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return new Paged<PaymentRequest>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                Total = paymentRequests.Count()
            };
        }

        public async Task<PaymentRequest> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            var paymentRequest = await Query()
                .Include(pr => pr.Payments)
                .FirstOrDefaultAsync(pr => pr.Code == code, cancellationToken);

            if (paymentRequest == null)
            {
                throw new CustomErrorsException(PersistenceErrorCode.NotFoundError.ToString(), code,
                    "A payment request was not found matching the provided code.");
            }

            return paymentRequest;
        }

        public async Task<PaymentRequest> GetByCodeForCustomerAsync(string customerCode, string code, CancellationToken cancellationToken = default)
        {
            var paymentRequest = await Query()
                .Include(pr => pr.Payments)
                .FirstOrDefaultAsync(pr => pr.Code == code && pr.CustomerCode == customerCode, cancellationToken);

            if (paymentRequest == null)
            {
                throw new CustomErrorsException(PersistenceErrorCode.NotFoundError.ToString(), code,
                    "A payment request for the customer was not found matching the provided code.");
            }

            return paymentRequest;
        }

        public async Task<PaymentRequest> GetByCodeForMerchantAsync(string paymentRequestCode, CancellationToken cancellationToken = default)
        {
            var paymentRequest = await Query()
                .Include(pr => pr.Callbacks)
                .Include(pr => pr.Payments)
                .FirstOrDefaultAsync(pr => pr.Code == paymentRequestCode && pr.IsMerchant, cancellationToken);

            if (paymentRequest == null)
            {
                throw new CustomErrorsException(PersistenceErrorCode.NotFoundError.ToString(), paymentRequestCode,
                    "A merchant payment request was not found matching the provided code.");
            }

            return paymentRequest;
        }

        public async Task<IEnumerable<PaymentRequest>> GetOpenPaymentRequestsToExpireAsync(CancellationToken cancellationToken = default)
        {
            return await Query()
                .Where(pr => pr.Options.ExpiresOn.HasValue && DateTimeProvider.UtcNow > pr.Options.ExpiresOn.Value
                    && pr.Status == PaymentRequestStatus.Open)
                .Take(20)
                .ToListAsync(cancellationToken);
        }
    }
}
