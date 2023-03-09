// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Web.SDK.HTTP;
using Web.SDK.ROP;
using Web.SDK.Services.Interfaces;
using Web.SDK.Services.Models.Requests;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services
{
    public class MerchantService : IMerchantService
    {
        private readonly HttpClient _authorizedClient;
        private readonly HttpClient _unauthorizedClient;

        public MerchantService(IHttpClientFactory factory)
        {
            _authorizedClient = factory.CreateClient(Constants.CoreApiWithAuth);
            _unauthorizedClient = factory.CreateClient(Constants.CoreApiNoAuth);
        }

        public async Task<Result<MerchantPaymentRequestResponse>> CreatePaymentRequestAsync(CreateMerchantPaymentRequestCommand command, CancellationToken cancellationToken = default)
        {
            var request = new RequestBuilder(_authorizedClient).SetSegments("api", "paymentrequests", "merchant");
            return await request.ExecutePost<CreateMerchantPaymentRequestCommand, MerchantPaymentRequestResponse>(command, cancellationToken);
        }

        public async Task<Result<MerchantPaymentRequestResponse>> GetPaymentRequestAsync(string paymentRequestCode, CancellationToken cancellationToken = default)
        {
            var request = new RequestBuilder(_unauthorizedClient).SetSegments("api", "paymentrequests", "merchant", paymentRequestCode);
            return await request.ExecuteGet<MerchantPaymentRequestResponse>(cancellationToken);
        }
    }
}
