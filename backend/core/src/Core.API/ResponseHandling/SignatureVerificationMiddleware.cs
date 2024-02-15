// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Presentation.Models;
using NSec.Cryptography;
using System.Net;
using System.Text;

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
                string? publicKeyHeader = context.Request.Headers["x-public-key"];
                string? timestampHeader = context.Request.Headers["x-timestamp"];

                // Make sure the headers are present
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

                if (string.IsNullOrWhiteSpace(timestampHeader)
                    || !long.TryParse(timestampHeader, out var timestampHeaderLong))
                {
                    _logger.LogError("Missing timestamp header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "x-timestamp"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                // Check if the timestamp is within the allowed time
                if (!IsWithinAllowedTime(timestampHeaderLong))
                {
                    _logger.LogError("Timestamp outdated");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Invalid timestamp", "timestamp"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                }

                var payloadSigningStream = await GetPayloadStream(context, timestampHeader);

                // Parse the public key
                var publicKeyBytes = Convert.FromBase64String(publicKeyHeader);

                // Decode the signature header from Base64
                var signatureBytes = Convert.FromBase64String(signatureHeader);

                if (VerifySignature(publicKeyBytes, payloadSigningStream.ToArray(), signatureBytes))
                {
                    // Signature is valid, continue with the request
                    await _next(context);
                }
                else
                {
                    _logger.LogError("Invalid signature");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Invalid signature", "x-signature"));
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

        private static async Task<MemoryStream> GetPayloadStream(HttpContext context, string timestampHeader)
        {
            // Leave the body open so the next middleware can read it.
            context.Request.EnableBuffering();

            // Set-up the payload stream to verify the signature
            var payloadSigningStream = new MemoryStream();

            // Copy the timestamp to the payload stream
            await payloadSigningStream.WriteAsync(Encoding.UTF8.GetBytes(timestampHeader));

            // Copy the request body to the payload stream
            await context.Request.Body.CopyToAsync(payloadSigningStream);

            // Reset the request body stream position so the next middleware can read it
            context.Request.Body.Position = 0;

            return payloadSigningStream;
        }

        private static bool IsWithinAllowedTime(long timestampHeaderLong)
        {
            var suppliedDateTimec = DateTimeOffset.FromUnixTimeSeconds(timestampHeaderLong);
            var dateDiff = DateTimeOffset.UtcNow - suppliedDateTimec;
            long allowedDifference = 30; // 30 seconds
            return Math.Abs(dateDiff.TotalSeconds) <= allowedDifference;
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
