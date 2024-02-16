using Core.Domain.Abstractions;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Repositories;

namespace Core.APITests;

public class FakeCustomerDeviceRepository : ICustomerDeviceRepository
{
    public void Add(CustomerOTPKeyStore entity)
    {
        throw new NotImplementedException();
    }

    public Task<CustomerOTPKeyStore> FindAsync(int id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<CustomerOTPKeyStore?> GetAsync(string customerCode, CancellationToken cancellationToken = default)
    {
        var store = new CustomerOTPKeyStore
        {
            CustomerCode = customerCode,
            PublicKeys = new[] { new CustomerDevicePublicKeys { PublicKey = "VALID-PUBKEY" } }
        };

        return Task.FromResult(store)!;
    }

    public Task<bool> HasOtpKeyAsync(string customerCode, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(false);
    }

    public Task<bool> HasPublicKeyAsync(string customerCode, string publicKey,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<List<CustomerOTPKeyStore>> ListAsync(ISpecification<CustomerOTPKeyStore> specification,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public void Update(CustomerOTPKeyStore entity)
    {
        throw new NotImplementedException();
    }
}