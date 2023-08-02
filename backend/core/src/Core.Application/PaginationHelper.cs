using Core.Domain.Primitives;
// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain
{
    public class PaginationHelper<T>
    {
        public Paged<T> GetPagedList(IEnumerable<T> items, int page, int pageSize)
        {
            // Ensure page and pageSize are valid and non-negative
            page = Math.Max(1, page); // Page should be at least 1
            pageSize = Math.Max(1, pageSize); // PageSize should be at least 1

            var totalItems = items.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            // Ensure the page is within the valid range
            page = Math.Min(page, totalPages);

            // Calculate the start and end indexes for the requested page
            var startIndex = (page - 1) * pageSize;
            var endIndex = Math.Min(startIndex + pageSize - 1, totalItems - 1);

            // Slice the items to get the requested page
            var pagedItems = items.Skip(startIndex).Take(endIndex - startIndex + 1).ToList();

            return new Paged<T>
            {
                Items = pagedItems,
                Page = page,
                PageSize = pageSize,
                Total = totalItems
            };
        }
    }
}
