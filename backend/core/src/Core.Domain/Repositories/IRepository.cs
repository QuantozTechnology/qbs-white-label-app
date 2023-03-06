namespace Core.Domain.Repositories
{
    public interface IRepository<T>
    {
        public void Add(T entity);

        public void Update(T entity);

        public Task<T> FindAsync(int id, CancellationToken cancellationToken = default);
    }
}
