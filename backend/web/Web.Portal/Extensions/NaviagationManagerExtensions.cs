// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
