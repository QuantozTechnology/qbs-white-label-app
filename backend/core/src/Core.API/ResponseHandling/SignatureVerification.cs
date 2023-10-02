// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Core.Presentation.Models;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Core.API.ResponseHandling
{
    public static class SignatureVerification
    {
        public static async Task<bool> SignatureVerificationAsync(HttpContext context)
        {
            try
            {
                // Retrieve headers from the request
                string publicKeyHeader = context.Request.Headers["x-public-key"];
                string signatureHeader = context.Request.Headers["x-signature"];

                // Ensure both headers are present
                if (string.IsNullOrWhiteSpace(publicKeyHeader) || string.IsNullOrWhiteSpace(signatureHeader))
                {
                    return false;
                }

                string? payloadData = null;

                // Retrieve the payload data from the request body (if it's a POST request)
                if (context.Request.Method == "POST")
                {
                    using (StreamReader reader = new StreamReader(context.Request.Body, Encoding.UTF8))
                    {
                        payloadData = await reader.ReadToEndAsync();
                    }
                }

                // Verify the signature
                bool isSignatureValid = VerifySignature(publicKeyHeader, signatureHeader, payloadData);

                return isSignatureValid;
            }
            catch
            {
                return false;
            }
        }

        private static bool VerifySignature(string publicKeyPem, string signatureBase64, string data)
        {
            try
            {
                byte[] publicKeyBytes = Encoding.UTF8.GetBytes(publicKeyPem);
                byte[] signatureBytes = Convert.FromBase64String(signatureBase64);
                byte[] dataBytes = Encoding.UTF8.GetBytes(data);

                using (RSA rsa = RSA.Create())
                {
                    rsa.ImportFromPem(publicKeyBytes);

                    return rsa.VerifyData(dataBytes, signatureBytes, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                }
            }
            catch
            {

            }
        }
    }
}
