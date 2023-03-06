using Web.SDK.HTTP;
using Web.SDK.ROP;
using Web.SDK.Services.Interfaces;
using Web.SDK.Services.Models.Requests;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services
{
    public class PaymentRequestService : IPaymentRequestService
    {
        private readonly HttpClient _client;

        public PaymentRequestService(IHttpClientFactory factory)
        {
            _client = factory.CreateClient(Constants.CoreApiWithAuth);
        }

        public async Task<Result<PaymentRequestResponse>> CreatePaymentRequestAsync(CreatePaymentRequestRequest command, CancellationToken cancellationToken = default)
        {
            var request = new RequestBuilder(_client).SetSegments("api", "paymentrequests");
            return await request.ExecutePost<CreatePaymentRequestRequest, PaymentRequestResponse>(command, cancellationToken);
        }
    }
}
