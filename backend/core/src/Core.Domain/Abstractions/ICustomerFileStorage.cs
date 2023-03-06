using Core.Domain.Primitives;

namespace Core.Domain.Abstractions
{
    public interface ICustomerFileStorage
    {
        Task<string> UploadToCustomerContainer(CustomerFile file);
    }
}