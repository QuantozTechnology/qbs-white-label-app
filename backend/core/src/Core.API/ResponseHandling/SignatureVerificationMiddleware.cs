// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Presentation.Models;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Security.Cryptography;
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
                    _logger.LogError("Missing x-signature header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "x-signature"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                byte[] payloadBytes = Encoding.UTF8.GetBytes(payloadHeader);

                JObject payloadJson = JObject.Parse(payloadHeader);

                string? publicKey = null;
                string? postPayload = null;

                if (method == "POST" || method == "PUT")
                {
                    // Check if the "PostPayload" property is present
                    if (payloadJson.TryGetValue(SignaturePayload.PostPayload, out var post))
                    {
                        postPayload = (string?)post;
                    }
                    else
                    {
                        _logger.LogError("Missing postPayload header");
                        var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "postPayload"));
                        await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                        return;
                    }
                }

                // Check if the "publicKey" property is present
                if (payloadJson.TryGetValue(SignaturePayload.PublicKey, out var pubKey))
                {
                    publicKey = (string?)pubKey;
                }
                else
                {
                    _logger.LogError("Missing publicKey header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "publicKey"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                // Get the current Unix UTC timestamp (rounded to 30 seconds)
                long currentTimestamp = (long)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

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
                    if (VerifySignature(publicKey!, payloadBytes, signatureBytes))
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
                    _logger.LogError("Invalid signature");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Invalid signature", "x-signature"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Unknown exception thrown: {message}", ex.Message);
                throw new Exception("Unknown exception thrown: {message}", ex);
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

        private static bool VerifySignature(string publicKey, byte[] payload, byte[] signature)
        {
            try
            {
                using (RSA rsa = RSA.Create())
                {
                    // Import the public key (assuming it's in PEM format)
                    rsa.ImportFromPem(publicKey);

                    // Verify the signature using the SHA256 algorithm and PKCS1 padding
                    var isValidSignature = rsa.VerifyData(payload, signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);

                    return isValidSignature;
                }
            }
            catch (CryptographicException)
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