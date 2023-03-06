using Web.SDK.HTTP;
using Web.SDK.ROP;
using Web.SDK.Services.Interfaces;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services
{
    public class AccountService : IAccountService
    {
        private readonly HttpClient _client;

        public AccountService(IHttpClientFactory factory)
        {
            _client = factory.CreateClient(Constants.CoreApiWithAuth);
        }

        public async Task<Result<AccountResponse>> GetAccountAsync()
        {
            var request = new RequestBuilder(_client).SetSegments("accounts");
            return await request.ExecuteGet<AccountResponse>();
        }

        public async Task<Result<IEnumerable<AccountBalanceResponse>>> GetAccountBalanceAsync()
        {
            var request = new RequestBuilder(_client).SetSegments("api", "accounts", "balances");
            return await request.ExecuteGet<IEnumerable<AccountBalanceResponse>>();
        }
    }
}
