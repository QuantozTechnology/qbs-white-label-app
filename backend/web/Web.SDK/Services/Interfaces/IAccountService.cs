using Web.SDK.ROP;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services.Interfaces
{
    public interface IAccountService
    {
        public Task<Result<AccountResponse>> GetAccountAsync();

        public Task<Result<IEnumerable<AccountBalanceResponse>>> GetAccountBalanceAsync();
    }
}
