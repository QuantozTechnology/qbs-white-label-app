using Web.SDK.ROP;
using Web.SDK.Services.Models.Responses;

namespace Web.SDK.Services.Interfaces
{
    public interface ICustomerService
    {
        public Task<Result<CustomerResponse>> GetCustomerAsync();

        public Task<Result<IEnumerable<CustomerLimitResponse>>> GetCustomerLimitsAsync();
    }
}
