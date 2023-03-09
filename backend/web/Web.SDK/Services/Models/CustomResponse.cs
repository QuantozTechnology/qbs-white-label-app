// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Text.Json.Serialization;

namespace Web.SDK.Services.Models
{
    public class CustomResponse<T>
    {
        public CustomResponse(T value)
        {
            Value = value;
        }
        public T Value { get; set; }
    }

    public class EmptyCustomResponse
    {
        public object? Value { get; set; }
        public EmptyCustomResponse()
        {
            Value = new();
        }
    }
}