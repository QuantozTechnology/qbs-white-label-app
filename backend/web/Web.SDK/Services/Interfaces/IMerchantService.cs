// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Web.SDK.ROP;
using Web.SDK.Services.Models.Requests;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services.Interfaces
{
    public interface IMerchantService
    {
        public Task<Result<MerchantPaymentRequestResponse>> CreatePaymentRequestAsync(CreateMerchantPaymentRequestCommand command, CancellationToken cancellationToken = default);

        public Task<Result<MerchantPaymentRequestResponse>> GetPaymentRequestAsync(string paymentRequestCode, CancellationToken cancellationToken = default);
    }
}
