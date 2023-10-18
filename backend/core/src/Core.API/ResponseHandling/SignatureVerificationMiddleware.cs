// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Presentation.Models;
using Newtonsoft.Json;
using System.Net;
using System.Security.Cryptography;
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
                string? publicKeyHeader = context.Request.Headers["x-public-key"];
                string? signatureHeader = context.Request.Headers["x-signature"];

                // Retrieve method from the request
                var method = context.Request.Method;

                // Ensure both headers are present
                if (string.IsNullOrWhiteSpace(publicKeyHeader) || string.IsNullOrWhiteSpace(signatureHeader))
                {
                    _logger.LogError("Missing x-signature header");
                    var customErrors = new CustomErrors(new CustomError("Forbidden", "Missing Header", "x-signature"));
                    await WriteCustomErrors(context.Response, customErrors, (int)HttpStatusCode.Forbidden);
                    return;
                }

                // Get the current Unix UTC timestamp (rounded to 30 seconds)
                long currentTimestamp = (long)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                currentTimestamp = (currentTimestamp / 30) * 30; // Round to the nearest 30 seconds

                string? postPayload = string.Empty;
                string? payload = null;

                switch (method)
                {
                    case "POST":
                    case "PUT":
                        {
                            using (StreamReader reader = new(context.Request.Body, Encoding.UTF8))
                            {
                                postPayload = await reader.ReadToEndAsync();
                            }

                            payload = JsonConvert.SerializeObject(new
                            {
                                publicKey = publicKeyHeader,
                                timestamp = currentTimestamp,
                                postPayload
                            }, Formatting.None);
                            break;
                        }

                    default:
                        payload = JsonConvert.SerializeObject(new
                        {
                            publicKey = publicKeyHeader,
                            timestamp = currentTimestamp
                        }, Formatting.None);
                        break;
                }

                byte[] payloadBytes = Encoding.UTF8.GetBytes(payload);

                // Decode the signature header from Base64
                byte[]? signatureBytes = Convert.FromBase64String(signatureHeader);

                // Verify the signature
                if (VerifySignature(publicKeyHeader, payloadBytes, signatureBytes))
                {
                    await _next(context); // Signature is valid, continue with the request
                }
                else
                {
                    // Check the previous timestamp (30 seconds ago)
                    long previousTimestamp = currentTimestamp - 30;

                    string? updatedPayload = null;

                    switch (method)
                    {
                        case "POST":
                        case "PUT":
                            {
                                updatedPayload = JsonConvert.SerializeObject(new
                                {
                                    publicKey = publicKeyHeader,
                                    timestamp = previousTimestamp,
                                    postPayload
                                });
                                break;
                            }

                        default:
                            updatedPayload = JsonConvert.SerializeObject(new
                            {
                                publicKey = publicKeyHeader,
                                timestamp = previousTimestamp
                            });
                            break;
                    }

                    payloadBytes = Encoding.UTF8.GetBytes(updatedPayload);

                    // Verify the signature again with the previous timestamp
                    if (VerifySignature(publicKeyHeader, payloadBytes, signatureBytes))
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
            publicKey = publicKey.Replace("\\n", "\n");

            try
            {
                using (RSA rsa = RSA.Create())
                {
                    // Import the public key (assuming it's in PEM format)
                    rsa.ImportFromPem(publicKey);

                    // Verify the signature using the SHA256 algorithm and PKCS1 padding
                    return rsa.VerifyData(payload, signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
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
