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
