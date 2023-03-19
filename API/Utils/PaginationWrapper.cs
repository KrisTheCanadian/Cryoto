using System.Diagnostics.CodeAnalysis;

namespace API.Utils;

[ExcludeFromCodeCoverage]
public class PaginationWrapper<T>
{
    public PaginationWrapper(IEnumerable<T> data, int page, int itemsPerPage, int totalPages)
    {
        Data = data;
        Page = page;
        ItemsPerPage = itemsPerPage;
        TotalPages = totalPages;
    }

    public IEnumerable<T> Data { get; set; }
    public int Page { get; set; }
    public int ItemsPerPage { get; set; }

    public int TotalPages { get; set; }
}