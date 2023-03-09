// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;

namespace Core.Presentation.Models
{
    public class CustomErrorsResponse
    {
        public required IEnumerable<CustomErrorResponse> Errors { get; set; }

        public static CustomErrorsResponse FromCustomErrors(CustomErrors customErrors)
        {
            return new CustomErrorsResponse
            {
                Errors = customErrors.Errors.Select(ce => CustomErrorResponse.FromCustomErrors(ce))
            };
        }
    }

    public record CustomErrorResponse()
    {
        public required string Code { get; set; }
        public required string Message { get; set; }
        public required string Target { get; set; }

        public static CustomErrorResponse FromCustomErrors(CustomError customError)
        {
            return new CustomErrorResponse
            {
                Code = customError.Code,
                Message = customError.Message,
                Target = customError.Target
            };
        }
    }
}
