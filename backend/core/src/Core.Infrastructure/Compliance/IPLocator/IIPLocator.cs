using Core.Infrastructure.Compliance.IPLocator.Models;

namespace Core.Infrastructure.Compliance.IPLocator
{
    public interface IIPLocator
    {
        Task<ISPResponse> GetISP(string ip);
    }
}
