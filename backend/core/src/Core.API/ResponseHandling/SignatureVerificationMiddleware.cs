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
    /// <summary>
    /// Middleware to verify the signature of incoming requests.
    /// It reads the x-signature, x-algorithm, x-public-key and x-timestamp headers from the request.
    /// Using the supported algorithm it verifies the signature of the request.
    ///
    /// A 30 second time difference is allowed between the timestamp in the request and the server time.
    ///
    /// Checking if the public-key is valid is not done in this middleware.
    /// </summary>
    public class SignatureVerificationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TimeProvider _timeProvider;
        private readonly ILogger<SignatureVerificationMiddleware> _logger;

        public SignatureVerificationMiddleware(
            RequestDelegate next,
            TimeProvider timeProvider,
            ILogger<SignatureVerificationMiddleware> logger)
        {
            _next = next;
            _timeProvider = timeProvider;
            _logger = logger;
        }

        private enum SignatureAlgorithmHeader
        {
            ED25519
        }

        public async Task Invoke(HttpContext context)
        {
            if (!SkipEndpoint(context))
            {
                // Retrieve headers from the request
                string? signatureHeader = context.Request.Headers["x-signature"];
                string? algorithmHeader = context.Request.Headers["x-algorithm"];
                string? publicKeyHeader = context.Request.Headers["x-public-key"];
                string? timestampHeader = context.Request.Headers["x-timestamp"];

                // Make sure the headers are present
                if (!Enum.TryParse<SignatureAlgorithmHeader>(algorithmHeader, ignoreCase: true, out _))
                {
                    _logger.LogError("Invalid algorithm header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Invalid Header", "x-algorithm"));
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
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Invalid timestamp", "x-timestamp"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                // TODO: Check if the public key is valid according to algorithm

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
            await _next(context);
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

        private bool IsWithinAllowedTime(long timestampHeaderLong)
        {
            var suppliedDateTime = DateTimeOffset.FromUnixTimeSeconds(timestampHeaderLong);
            var dateDiff = _timeProvider.GetUtcNow() - suppliedDateTime;
            long allowedDifference = 30; // 30 seconds
            return Math.Abs(dateDiff.TotalSeconds) <= allowedDifference;
        }

        private static async Task WriteCustomErrors(HttpResponse httpResponse, CustomErrors customErrors,
            int statusCode)
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

        /// <summary>
        /// Skip the middleware for specific endpoints
        /// </summary>
        private static bool SkipEndpoint(HttpContext context)
        {
            var endpoint = context.GetEndpoint();
            var endpointName = endpoint?.Metadata.GetMetadata<EndpointNameMetadata>()?.EndpointName;

            var excludeList = new[] { "SendOTPCodeEmail" };

            return context.Request.Path.StartsWithSegments("/health")
                   || excludeList.Contains(endpointName);
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