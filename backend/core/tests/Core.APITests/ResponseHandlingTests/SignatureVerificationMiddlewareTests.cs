// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.API.ResponseHandling;
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
            string publicKey = "-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnLQKInx7UeHsc99RPHHT\r\ndBs5jQZoTOswJc6pE4+dggmbf4b/XKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHz\r\nd2ZPjyeakERGjS2ZKBCo1ysYnP0bROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s\r\n3hVLOzdLlHEisjTkHUsDJATg8J8EHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko\r\n+bVQxtv1/ZiGhDsWUPNGss1hXmXBQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZ\r\nwRvezSnUfGcY0h/HG/TMs1EGfUecgI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+f\r\ngwIDAQAB\r\n-----END PUBLIC KEY-----";
            string privateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpAIBAAKCAQEAnLQKInx7UeHsc99RPHHTdBs5jQZoTOswJc6pE4+dggmbf4b/\r\nXKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHzd2ZPjyeakERGjS2ZKBCo1ysYnP0b\r\nROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s3hVLOzdLlHEisjTkHUsDJATg8J8E\r\nHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko+bVQxtv1/ZiGhDsWUPNGss1hXmXB\r\nQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZwRvezSnUfGcY0h/HG/TMs1EGfUec\r\ngI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+fgwIDAQABAoIBAQCXZIl2D/XEghTD\r\nTblaQE4eGj9btBkIVyBJJoPK1jFB9K46Yt5LS2I/ie8VnBgEcpVa1FCJ5tBha14V\r\njMTG5S7m5/1tPMHjJ1NSCf+x6YZ1erlo0k+KHldaBsdjk9iRwT9Uh+kBGeMUt78C\r\nIKbpdXYmiUQJjb6DR1pR+S957YK3REro6HWBhYwRAnPCukchaD6efaUN2yoqm/7g\r\nMy5avNFeJ+3VaR+RejylZd+IoGIAYRW7Lgu5x2g9SD1O2HaX/tfPj9ouz+5c8J2e\r\nciNnDqI8M78zhgpcFvgoFdHNL+UiSUEGen+ZCT9JiPNEH/AI2zxc8TtCjIpA0qJk\r\nJ/MxRP6BAoGBANpd9+wC/meOcsOPBZYra/vIc7Oo2OVOrdYZQQ89so2ZlbtSoPP6\r\n9wN84d6M56oulApE4F4zdlgojSWo3S/4qN93ZptR1vuSIml7eAkH9BQJSnlHgFjf\r\ntdF1zcXV4bSxnqkdZh5i77aioVm0fCkdJgQyRbewiqp7Jp/z5dqpseYRAoGBALe1\r\njmeXZ3bIzbq33EO+pc3NIQODhpDiRsZJfrneH7tm4N2UWp8vBKBqjwmMxFO4LMPx\r\nH0amnhtLvq0cOCgVyN9zekTWtIuyOw9KKfrmJ3zfRY1oRV2Fn+h6dWIveWj1hm0H\r\n6yv5xznaUuNzlRubXshWyC/eyMPAUatYrf5tKYhTAoGAMt5/GcDcyPz7KSlRMNlu\r\nr1nT8j9cP5bjkiOR7139EVV89wVZr1yAXJSj/XcvpIpzPC0tY2RzpjfUIbjDxiAU\r\nHvKuuXIINdSmJZJ4tQngRyae7b/FW27J6UCbLgIUMUbLYjQSDPQZSZ97HO2Zmu5K\r\nY+HeMdtzgiFsLwjfO+AaLDECgYAO9SFbHeC2szLM+RteCK/HSeRePN8//Kx2iJVg\r\n3M0InR/B6spWG6XsycBLrsJtbpl2erNpNTe6UTh9L8cCvINWbjiOUkzw8toMLKWu\r\nX/7nE+a91LeRHcgfTZkxHVxtR1BioDptojCubTBChK6nSMc22JoEC8ec6JO9t8Ky\r\n7IBtMQKBgQDWIihg/WYVZh6a7LQ2LayHJ39JvOUhOPUK0LN3hxlUnIiJWczJf41i\r\nt8c/ooKmrFMGh3Nc9P42wqdsRQrnt1de3otGNQmAgrO65QZbOvr7hhSp6znb6d+T\r\nytUeiYdFC/xmBbQoZ6Fz3r72T36VWuRatULkYrOAGTKlwtWKD3oByQ==\r\n-----END RSA PRIVATE KEY-----";
            byte[] payload = Encoding.UTF8.GetBytes("{\"timestamp\": 1700136384437}");
            byte[] signature;

            using (RSA rsa = RSA.Create())
            {
                rsa.ImportFromPem(privateKey);
                signature = rsa.SignData(payload, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
            }

            // Act
            bool result = SignatureVerificationMiddleware.VerifySignature(publicKey, payload, signature);

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void VerifySignature_InvalidSignature_ReturnsFalse()
        {
            string publicKey = "-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnLQKInx7UeHsc99RPHHT\r\ndBs5jQZoTOswJc6pE4+dggmbf4b/XKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHz\r\nd2ZPjyeakERGjS2ZKBCo1ysYnP0bROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s\r\n3hVLOzdLlHEisjTkHUsDJATg8J8EHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko\r\n+bVQxtv1/ZiGhDsWUPNGss1hXmXBQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZ\r\nwRvezSnUfGcY0h/HG/TMs1EGfUecgI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+f\r\ngwIDAQAB\r\n-----END PUBLIC KEY-----";
            string privateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpAIBAAKCAQEAnLQKInx7UeHsc99RPHHTdBs5jQZoTOswJc6pE4+dggmbf4b/\r\nXKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHzd2ZPjyeakERGjS2ZKBCo1ysYnP0b\r\nROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s3hVLOzdLlHEisjTkHUsDJATg8J8E\r\nHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko+bVQxtv1/ZiGhDsWUPNGss1hXmXB\r\nQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZwRvezSnUfGcY0h/HG/TMs1EGfUec\r\ngI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+fgwIDAQABAoIBAQCXZIl2D/XEghTD\r\nTblaQE4eGj9btBkIVyBJJoPK1jFB9K46Yt5LS2I/ie8VnBgEcpVa1FCJ5tBha14V\r\njMTG5S7m5/1tPMHjJ1NSCf+x6YZ1erlo0k+KHldaBsdjk9iRwT9Uh+kBGeMUt78C\r\nIKbpdXYmiUQJjb6DR1pR+S957YK3REro6HWBhYwRAnPCukchaD6efaUN2yoqm/7g\r\nMy5avNFeJ+3VaR+RejylZd+IoGIAYRW7Lgu5x2g9SD1O2HaX/tfPj9ouz+5c8J2e\r\nciNnDqI8M78zhgpcFvgoFdHNL+UiSUEGen+ZCT9JiPNEH/AI2zxc8TtCjIpA0qJk\r\nJ/MxRP6BAoGBANpd9+wC/meOcsOPBZYra/vIc7Oo2OVOrdYZQQ89so2ZlbtSoPP6\r\n9wN84d6M56oulApE4F4zdlgojSWo3S/4qN93ZptR1vuSIml7eAkH9BQJSnlHgFjf\r\ntdF1zcXV4bSxnqkdZh5i77aioVm0fCkdJgQyRbewiqp7Jp/z5dqpseYRAoGBALe1\r\njmeXZ3bIzbq33EO+pc3NIQODhpDiRsZJfrneH7tm4N2UWp8vBKBqjwmMxFO4LMPx\r\nH0amnhtLvq0cOCgVyN9zekTWtIuyOw9KKfrmJ3zfRY1oRV2Fn+h6dWIveWj1hm0H\r\n6yv5xznaUuNzlRubXshWyC/eyMPAUatYrf5tKYhTAoGAMt5/GcDcyPz7KSlRMNlu\r\nr1nT8j9cP5bjkiOR7139EVV89wVZr1yAXJSj/XcvpIpzPC0tY2RzpjfUIbjDxiAU\r\nHvKuuXIINdSmJZJ4tQngRyae7b/FW27J6UCbLgIUMUbLYjQSDPQZSZ97HO2Zmu5K\r\nY+HeMdtzgiFsLwjfO+AaLDECgYAO9SFbHeC2szLM+RteCK/HSeRePN8//Kx2iJVg\r\n3M0InR/B6spWG6XsycBLrsJtbpl2erNpNTe6UTh9L8cCvINWbjiOUkzw8toMLKWu\r\nX/7nE+a91LeRHcgfTZkxHVxtR1BioDptojCubTBChK6nSMc22JoEC8ec6JO9t8Ky\r\n7IBtMQKBgQDWIihg/WYVZh6a7LQ2LayHJ39JvOUhOPUK0LN3hxlUnIiJWczJf41i\r\nt8c/ooKmrFMGh3Nc9P42wqdsRQrnt1de3otGNQmAgrO65QZbOvr7hhSp6znb6d+T\r\nytUeiYdFC/xmBbQoZ6Fz3r72T36VWuRatULkYrOAGTKlwtWKD3oByQ==\r\n-----END RSA PRIVATE KEY-----";
            byte[] payload = Encoding.UTF8.GetBytes("{\"timestamp\": 1700136384437}");
            byte[] validSignature;

            using (RSA rsa = RSA.Create())
            {
                rsa.ImportFromPem(privateKey);
                validSignature = rsa.SignData(payload, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
            }

            // Modifying the payload to create an invalid signature
            byte[] modifiedPayload = Encoding.UTF8.GetBytes("{\"timestamp\": 17001363844}");

            // Act
            bool result = SignatureVerificationMiddleware.VerifySignature(publicKey, modifiedPayload, validSignature);

            // Assert
            Assert.IsFalse(result);
        }
    }
}