// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Core.API.ResponseHandling
{
    public class CustomBadRequest
    {
        public List<CustomError> Errors { get; set; } = new List<CustomError>();

        public CustomBadRequest(ActionContext context)
        {
            PopulateErrors(context);
        }

        private void PopulateErrors(ActionContext context)
        {
            foreach (var keyModelStatePair in context.ModelState)
            {
                var key = keyModelStatePair.Key;
                var errors = keyModelStatePair.Value.Errors;

                if (errors != null && errors.Count > 0)
                {
                    foreach (var error in errors)
                    {
                        Errors.Add(new CustomError("ValidationError", error.ErrorMessage, key));
                    }
                }
            }
        }
    }

    public static class MvcExtensions
    {
        public static void UseCustomErrorsResponseForValidationErrors(this IMvcBuilder mvc)
        {
            mvc.ConfigureApiBehaviorOptions(options =>
             {
                 options.InvalidModelStateResponseFactory = context =>
                 {
                     var errors = new CustomBadRequest(context);
                     return new BadRequestObjectResult(errors);
                 };
             });
        }
    }
}
