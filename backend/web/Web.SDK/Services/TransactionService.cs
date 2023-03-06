using Web.SDK.HTTP;
using Web.SDK.ROP;
using Web.SDK.Services.Interfaces;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly HttpClient _client;

        public TransactionService(IHttpClientFactory factory)
        {
            _client = factory.CreateClient(Constants.CoreApiWithAuth);
        }

        public async Task<Result<IEnumerable<TransactionResponse>>> GetTransactionsAsync(int page = 1, int pageSize = 10)
        {
            var request = new RequestBuilder(_client)
                .SetSegments("api", "transactions")
                .AddQueryParameter("page", page.ToString())
                .AddQueryParameter("pageSize", pageSize.ToString());

            return await request.ExecuteGet<IEnumerable<TransactionResponse>>();
        }
    }
}
