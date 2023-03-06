using Core.Domain.Entities.CallbackAggregate;

namespace Core.Domain.Repositories
{
    public interface ICallbackRepository : IRepository<Callback>
    {
        public Task<Callback> GetAsync(string code, CancellationToken cancellationToken = default);

        public Task<IEnumerable<Callback>> GetLatestCreatedAsync(CancellationToken cancellationToken = default);
    }
}
