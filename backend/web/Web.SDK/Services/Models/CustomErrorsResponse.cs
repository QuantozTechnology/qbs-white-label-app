// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Web.SDK.Services.Models
{
    public class CustomErrorsResponse
    {
        public static readonly CustomErrorsResponse None = new() { Errors = Array.Empty<CustomErrorResponse>() };

        public required IEnumerable<CustomErrorResponse> Errors { get; set; }
    }

    public record CustomErrorResponse()
    {
        public required string Code { get; set; }
        public required string Message { get; set; }
        public required string Target { get; set; }
    }
}
