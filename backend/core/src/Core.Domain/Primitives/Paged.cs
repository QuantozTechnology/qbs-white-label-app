namespace Core.Domain.Primitives
{
    public class Paged<T>
    {
        public required IEnumerable<T> Items { get; set; }
        public required int Page { get; set; }
        public required int PageSize { get; set; }
        public required int Total { get; set; }
        public int TotalPages => Total / PageSize + (Total % PageSize > 0 ? 1 : 0);
        public int? PreviousPage => Page > 1 ? Page - 1 : null;
        public int? NextPage => Page < TotalPages ? Page + 1 : null;
    }
}
