// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Text.Json;

namespace Web.SDK.HTTP;

public static class JsonSingleton
{
    public static T? GetInstance<T>(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException($"'{nameof(content)}' cannot be null or empty.", nameof(content));
        }

        return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }
}
