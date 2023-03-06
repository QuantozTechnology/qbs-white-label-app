using Core.Domain.Entities.SettingsAggregate;

namespace Core.Domain.Repositories
{
    public interface ISettingsRepository
    {
        Task<TrustLevel> GetTrustlevelAsync(string name, CancellationToken cancellationToken = default);
    }
}
