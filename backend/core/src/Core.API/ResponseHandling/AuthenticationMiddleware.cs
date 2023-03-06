using Core.Domain.Exceptions;
using Core.Presentation.Models;
using System.Net;
using System.Text.Json;

namespace Core.API.ResponseHandling
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            if (context.Response.StatusCode == (int)HttpStatusCode.Unauthorized)
            {
                var customErrors = new CustomErrors(new CustomError("Unauthorized", "You are not authorized to access this resource.", "Bearer"));
                await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Unauthorized);
            }
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

    public static class AuthenticationMiddlewareExtensions
    {
        public static void ConfigureCustomAuthenticationMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<AuthenticationMiddleware>();
        }
    }
}
