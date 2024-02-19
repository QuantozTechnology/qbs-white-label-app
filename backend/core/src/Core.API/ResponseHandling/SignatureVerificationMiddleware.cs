// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Presentation.Models;
using Newtonsoft.Json.Linq;
using NSec.Cryptography;
using System.Net;
using System.Text;
using static Core.Domain.Constants;

namespace Core.API.ResponseHandling
{
    public class SignatureVerificationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SignatureVerificationMiddleware> _logger;

        public SignatureVerificationMiddleware(
            RequestDelegate next,
            ILogger<SignatureVerificationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                // Retrieve headers from the request
                string? signatureHeader = context.Request.Headers["x-signature"];
                string? payloadHeader = context.Request.Headers["x-payload"];
                string? publicKeyHeader = context.Request.Headers["x-public-key"];

                // Retrieve method from the request
                var method = context.Request.Method;

                if (string.IsNullOrWhiteSpace(payloadHeader))
                {
                    _logger.LogError("Missing payload header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "x-payload"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                if (string.IsNullOrWhiteSpace(signatureHeader))
                {
                    _logger.LogError("Missing signature header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "x-signature"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                if (string.IsNullOrWhiteSpace(publicKeyHeader))
                {
                    _logger.LogError("Missing publicKey header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "x-public-key"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                byte[] payloadBytes = Convert.FromBase64String(payloadHeader);
                var payloadString = Encoding.UTF8.GetString(payloadBytes);

                JObject payloadJson = JObject.Parse(payloadString);

                byte[] publicKeyBytes = Convert.FromBase64String(publicKeyHeader);

                // Get the current Unix UTC timestamp (rounded to 30 seconds)
                long currentTimestamp = (long)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                currentTimestamp = (currentTimestamp / 30) * 30; // Round to the nearest 30 seconds

                // Decode the signature header from Base64
                byte[]? signatureBytes = Convert.FromBase64String(signatureHeader);

                long timestamp = 0;

                // Check if the "timestamp" property is present
                if (payloadJson.TryGetValue(SignaturePayload.Timestamp, out var timestampToken))
                {
                    // Extract the timestamp value
                    timestamp = (long)timestampToken;
                }
                else
                {
                    _logger.LogError("Missing timestamp in header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "timestamp"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                bool isCurrentTime = timestamp == currentTimestamp;

                long allowedDifference = 30; // 30 seconds
                bool isWithin30Seconds = Math.Abs(currentTimestamp - timestamp) <= allowedDifference;

                if (isCurrentTime || isWithin30Seconds)
                {
                    if (VerifySignature(publicKeyBytes, payloadBytes, signatureBytes))
                    {
                        await _next(context); // Signature is valid, continue with the request
                    }
                    else
                    {
                        _logger.LogError("Invalid signature");
                        var customErrors = new CustomErrors(new CustomError("Forbidden", "Invalid signature", "x-signature"));
                        await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    }
                }
                else
                {
                    _logger.LogError("Timestamp outdated");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Invalid timestamp", "timestamp"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                }
            }
            catch (CustomErrorsException ex)
            {
                _logger.LogError(ex, "Unknown exception thrown: {message}", ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unknown exception thrown: {message}", ex.Message);
                var customErrors = new CustomErrors(new CustomError("Forbidden", ex.Message, ex.Source!));
                await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
            }
        }

        private static async Task WriteCustomErrors(HttpResponse httpResponse, CustomErrors customErrors, int statusCode)
        {
            httpResponse.StatusCode = statusCode;
            httpResponse.ContentType = "application/json";

            var response = CustomErrorsResponse.FromCustomErrors(customErrors);
            var json = System.Text.Json.JsonSerializer.Serialize(response);
            await httpResponse.WriteAsync(json);
        }

        public static bool VerifySignature(byte[] publicKey, byte[] payload, byte[] signature)
        {
            try
            {
                var pubKeyImport = PublicKey.Import(SignatureAlgorithm.Ed25519, publicKey, KeyBlobFormat.RawPublicKey);
                return SignatureAlgorithm.Ed25519.Verify(pubKeyImport, payload, signature);
            }
            catch
            {
                // Signature verification failed
                return false;
            }
        }
    }

    public static class SignatureVerificationMiddlewareExtensions
    {
        public static void ConfigureSignatureVerificationMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<SignatureVerificationMiddleware>();
        }
    }
}
