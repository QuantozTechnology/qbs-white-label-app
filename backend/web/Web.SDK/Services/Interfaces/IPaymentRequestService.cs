using Web.SDK.ROP;
using Web.SDK.Services.Models.Requests;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services.Interfaces
{
    public interface IPaymentRequestService
    {
        public Task<Result<PaymentRequestResponse>> CreatePaymentRequestAsync(CreatePaymentRequestRequest command, CancellationToken cancellationToken = default);
    }
}
