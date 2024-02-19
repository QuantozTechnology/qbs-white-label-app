// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.API.ResponseHandling;
using NSec.Cryptography;
using System.Security.Cryptography;
using System.Text;

namespace Core.APITests.ResponseHandlingTests.SignatureVerificationMiddlewareTests
{
    [TestClass()]
    public class SignatureVerificationMiddlewareTests
    {
        [TestMethod]
        public void VerifySignature_ValidSignature_ReturnsTrue()
        {
            var publicKeyB64 = "gwZ+LyQ+VLaIsWeSq3QFh+WaZHNgl07pXul++BsezoY=";
            var publicKey = Convert.FromBase64String(publicKeyB64);
            var privateKeyB64 = "bi3SJ0gfnWXpL3vkJIdgFetU5ZgmIGCYrLxEL9Nx2rQ=";
            var privateKey = Convert.FromBase64String(privateKeyB64);
            var payload = Encoding.UTF8.GetBytes("{\"timestamp\": 1700136384437}");

            var key = Key.Import(SignatureAlgorithm.Ed25519, privateKey, KeyBlobFormat.RawPrivateKey);

            var signature = SignatureAlgorithm.Ed25519.Sign(key, payload);

            // Act
            bool result = SignatureVerificationMiddleware.VerifySignature(publicKey, payload, signature);

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void VerifySignature_InvalidSignature_ReturnsFalse()
        {
            var publicKeyB64 = "gwZ+LyQ+VLaIsWeSq3QFh+WaZHNgl07pXul++BsezoY=";
            var publicKey = Convert.FromBase64String(publicKeyB64);
            var privateKeyB64 = "bi3SJ0gfnWXpL3vkJIdgFetU5ZgmIGCYrLxEL9Nx2rQ=";
            var privateKey = Convert.FromBase64String(privateKeyB64);
            var payload = Encoding.UTF8.GetBytes("{\"timestamp\": 1700136384437}");

            var key = Key.Import(SignatureAlgorithm.Ed25519, privateKey, KeyBlobFormat.RawPrivateKey);

            var validSignature = SignatureAlgorithm.Ed25519.Sign(key, payload);

            // Modifying the payload to create an invalid signature
            byte[] modifiedPayload = Encoding.UTF8.GetBytes("{\"timestamp\": 17001363844}");

            // Act
            bool result = SignatureVerificationMiddleware.VerifySignature(publicKey, modifiedPayload, validSignature);

            // Assert
            Assert.IsFalse(result);
        }
    }
}