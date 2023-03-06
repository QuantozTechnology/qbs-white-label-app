using Web.SDK.HTTP;
using Web.SDK.ROP;
using Web.SDK.Services.Interfaces;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly HttpClient _client;

        public CustomerService(IHttpClientFactory factory)
        {
            _client = factory.CreateClient(Constants.CoreApiWithAuth);
        }

        public async Task<Result<CustomerResponse>> GetCustomerAsync()
        {
            var request = new RequestBuilder(_client).SetSegments("api", "customers");
            return await request.ExecuteGet<CustomerResponse>();
        }

        public async Task<Result<IEnumerable<CustomerLimitResponse>>> GetCustomerLimitsAsync()
        {
            var request = new RequestBuilder(_client).SetSegments("api", "customers", "limits");
            return await request.ExecuteGet<IEnumerable<CustomerLimitResponse>>();
        }
    }
}
