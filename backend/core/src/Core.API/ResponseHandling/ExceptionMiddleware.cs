// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Presentation.Models;
using Microsoft.EntityFrameworkCore;
using Nexus.SDK.Shared.ErrorHandling;
using System.Text.Json;

namespace Core.API.ResponseHandling
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (NexusApiException ex)
            {
                _logger.LogError("Nexus API exception thrown: {message}", ex.Message);
                await HandleNexusExceptionAsync(httpContext, ex.Message, ex.ErrorCodes, ex.StatusCode);
            }
            catch (AuthProviderException ex)
            {
                _logger.LogError("Nexus Identity exception thrown: {message}", ex.Message);
                await HandleNexusExceptionAsync(httpContext, ex.Message);
            }
            catch (CustomErrorsException ex)
            {
                _logger.LogError("Custom error exception thrown: {exception}", ex.ToString());
                await HandleCustomErrorExceptionsAsync(httpContext, ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Unknown exception thrown: {message}", ex.Message);
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static async Task HandleCustomErrorExceptionsAsync(HttpContext context, CustomErrorsException exception)
        {
            int statusCode = 500;

            if (exception.CustomErrors.HasErrors())
            {
                statusCode = 400;

                if (exception.CustomErrors.Errors.Count == 1)
                {
                    var error = exception.CustomErrors.Errors[0];

                    if (error.Code.Contains("NotFound"))
                    {
                        statusCode = 404;
                    }
                }
            }
            else
            {
                exception.CustomErrors.AddError(new CustomError("InternalServerError", "CustomerErrorException was thrown but not errors are present", "Errors"));
            }

            await WriteCustomErrors(context.Response, exception.CustomErrors, statusCode);
        }

        private static async Task HandleNexusExceptionAsync(HttpContext context, string message, string? errorCode = null, int statusCode = 500)
        {
            var customError = new CustomError(errorCode ?? "NexusError", message: message, "Nexus");
            var customErrors = new CustomErrors(customError);
            await WriteCustomErrors(context.Response, customErrors, statusCode);
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var customError = new CustomError("InternalServerError", exception.Message, "Exception");
            var customErrors = new CustomErrors(customError);
            await WriteCustomErrors(context.Response, customErrors, 500);
        }

        private static async Task WriteCustomErrors(HttpResponse httpResponse, CustomErrors customErrors, int statusCode)
        {
            httpResponse.StatusCode = statusCode;
            httpResponse.ContentType = "application/json";

            var response = CustomErrorsResponse.FromCustomErrors(customErrors);
            var json = JsonSerializer.Serialize(response);
            await httpResponse.WriteAsync(json);
        }
    }

    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureCustomExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
        }
    }
}
