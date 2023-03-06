using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.WebUtilities;

namespace Web.Portal.Extensions
{
    public static class NavigationManagerExtensions
    {
        public static string? GetQueryString(this NavigationManager navManager, string key)
        {
            var uri = navManager.ToAbsoluteUri(navManager.Uri);

            if (QueryHelpers.ParseQuery(uri.Query).TryGetValue(key, out var valueFromQueryString))
            {
                return valueFromQueryString;
            }

            return null;
        }
    }
}
