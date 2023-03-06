namespace Core.Application.Queries.Interfaces
{
    public interface IPagedQuery
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
