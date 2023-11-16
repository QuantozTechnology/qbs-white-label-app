// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.API.ResponseHandling;
using Core.Domain.SignatureVerification;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace Core.APITests.ResponseHandlingTests
{
    [TestClass()]
    public class SignatureVerificationMiddlewareTests
    {
        [TestMethod]
        public async Task Middleware_ValidSignature_ContinuesWithRequest()
        {
            // Arrange
            var publicKeyHeader = "-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnLQKInx7UeHsc99RPHHT\r\ndBs5jQZoTOswJc6pE4+dggmbf4b/XKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHz\r\nd2ZPjyeakERGjS2ZKBCo1ysYnP0bROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s\r\n3hVLOzdLlHEisjTkHUsDJATg8J8EHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko\r\n+bVQxtv1/ZiGhDsWUPNGss1hXmXBQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZ\r\nwRvezSnUfGcY0h/HG/TMs1EGfUecgI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+f\r\ngwIDAQAB\r\n-----END PUBLIC KEY-----";
            var privateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpAIBAAKCAQEAnLQKInx7UeHsc99RPHHTdBs5jQZoTOswJc6pE4+dggmbf4b/\r\nXKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHzd2ZPjyeakERGjS2ZKBCo1ysYnP0b\r\nROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s3hVLOzdLlHEisjTkHUsDJATg8J8E\r\nHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko+bVQxtv1/ZiGhDsWUPNGss1hXmXB\r\nQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZwRvezSnUfGcY0h/HG/TMs1EGfUec\r\ngI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+fgwIDAQABAoIBAQCXZIl2D/XEghTD\r\nTblaQE4eGj9btBkIVyBJJoPK1jFB9K46Yt5LS2I/ie8VnBgEcpVa1FCJ5tBha14V\r\njMTG5S7m5/1tPMHjJ1NSCf+x6YZ1erlo0k+KHldaBsdjk9iRwT9Uh+kBGeMUt78C\r\nIKbpdXYmiUQJjb6DR1pR+S957YK3REro6HWBhYwRAnPCukchaD6efaUN2yoqm/7g\r\nMy5avNFeJ+3VaR+RejylZd+IoGIAYRW7Lgu5x2g9SD1O2HaX/tfPj9ouz+5c8J2e\r\nciNnDqI8M78zhgpcFvgoFdHNL+UiSUEGen+ZCT9JiPNEH/AI2zxc8TtCjIpA0qJk\r\nJ/MxRP6BAoGBANpd9+wC/meOcsOPBZYra/vIc7Oo2OVOrdYZQQ89so2ZlbtSoPP6\r\n9wN84d6M56oulApE4F4zdlgojSWo3S/4qN93ZptR1vuSIml7eAkH9BQJSnlHgFjf\r\ntdF1zcXV4bSxnqkdZh5i77aioVm0fCkdJgQyRbewiqp7Jp/z5dqpseYRAoGBALe1\r\njmeXZ3bIzbq33EO+pc3NIQODhpDiRsZJfrneH7tm4N2UWp8vBKBqjwmMxFO4LMPx\r\nH0amnhtLvq0cOCgVyN9zekTWtIuyOw9KKfrmJ3zfRY1oRV2Fn+h6dWIveWj1hm0H\r\n6yv5xznaUuNzlRubXshWyC/eyMPAUatYrf5tKYhTAoGAMt5/GcDcyPz7KSlRMNlu\r\nr1nT8j9cP5bjkiOR7139EVV89wVZr1yAXJSj/XcvpIpzPC0tY2RzpjfUIbjDxiAU\r\nHvKuuXIINdSmJZJ4tQngRyae7b/FW27J6UCbLgIUMUbLYjQSDPQZSZ97HO2Zmu5K\r\nY+HeMdtzgiFsLwjfO+AaLDECgYAO9SFbHeC2szLM+RteCK/HSeRePN8//Kx2iJVg\r\n3M0InR/B6spWG6XsycBLrsJtbpl2erNpNTe6UTh9L8cCvINWbjiOUkzw8toMLKWu\r\nX/7nE+a91LeRHcgfTZkxHVxtR1BioDptojCubTBChK6nSMc22JoEC8ec6JO9t8Ky\r\n7IBtMQKBgQDWIihg/WYVZh6a7LQ2LayHJ39JvOUhOPUK0LN3hxlUnIiJWczJf41i\r\nt8c/ooKmrFMGh3Nc9P42wqdsRQrnt1de3otGNQmAgrO65QZbOvr7hhSp6znb6d+T\r\nytUeiYdFC/xmBbQoZ6Fz3r72T36VWuRatULkYrOAGTKlwtWKD3oByQ==\r\n-----END RSA PRIVATE KEY-----";

            long currentTimestamp = (long)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

            var payload = JsonConvert.SerializeObject(new SignaturePayload
            {
                PublicKey = publicKeyHeader,
                Timestamp = currentTimestamp
            }, Formatting.None);

            var payloadBytes = Encoding.UTF8.GetBytes(payload);

            var signature = SignPayload(privateKey, payloadBytes);
            var signatureHeader = Convert.ToBase64String(signature);

            var logger = new Mock<ILogger<SignatureVerificationMiddleware>>();
            var context = new DefaultHttpContext();

            context.Request.Headers["x-public-key"] = publicKeyHeader;
            context.Request.Headers["x-signature"] = signatureHeader;

            var requestStream = new MemoryStream(Encoding.UTF8.GetBytes(payload));
            context.Request.Body = requestStream;
            context.Request.Method = "GET";

            var next = new RequestDelegate(innerContext => Task.CompletedTask);
            var middleware = new SignatureVerificationMiddleware(next, logger.Object);

            // Act
            await middleware.Invoke(context);

            // Assert
            // Ensure that the middleware allowed the request to continue
            Assert.AreEqual(200, context.Response.StatusCode);
        }

        [TestMethod]
        public async Task Middleware_ValidSignature_WithPostPayload_ContinuesWithRequest()
        {
            // Arrange
            var publicKeyHeader = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnLQKInx7UeHsc99RPHHTdBs5jQZoTOswJc6pE4+dggmbf4b/XKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHzd2ZPjyeakERGjS2ZKBCo1ysYnP0bROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s3hVLOzdLlHEisjTkHUsDJATg8J8EHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko+bVQxtv1/ZiGhDsWUPNGss1hXmXBQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZwRvezSnUfGcY0h/HG/TMs1EGfUecgI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+fgwIDAQAB-----END PUBLIC KEY-----";
            var privateKey = "-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAnLQKInx7UeHsc99RPHHTdBs5jQZoTOswJc6pE4+dggmbf4b/XKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHzd2ZPjyeakERGjS2ZKBCo1ysYnP0bROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s3hVLOzdLlHEisjTkHUsDJATg8J8EHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko+bVQxtv1/ZiGhDsWUPNGss1hXmXBQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZwRvezSnUfGcY0h/HG/TMs1EGfUecgI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+fgwIDAQABAoIBAQCXZIl2D/XEghTDTblaQE4eGj9btBkIVyBJJoPK1jFB9K46Yt5LS2I/ie8VnBgEcpVa1FCJ5tBha14VjMTG5S7m5/1tPMHjJ1NSCf+x6YZ1erlo0k+KHldaBsdjk9iRwT9Uh+kBGeMUt78CIKbpdXYmiUQJjb6DR1pR+S957YK3REro6HWBhYwRAnPCukchaD6efaUN2yoqm/7gMy5avNFeJ+3VaR+RejylZd+IoGIAYRW7Lgu5x2g9SD1O2HaX/tfPj9ouz+5c8J2eciNnDqI8M78zhgpcFvgoFdHNL+UiSUEGen+ZCT9JiPNEH/AI2zxc8TtCjIpA0qJkJ/MxRP6BAoGBANpd9+wC/meOcsOPBZYra/vIc7Oo2OVOrdYZQQ89so2ZlbtSoPP69wN84d6M56oulApE4F4zdlgojSWo3S/4qN93ZptR1vuSIml7eAkH9BQJSnlHgFjftdF1zcXV4bSxnqkdZh5i77aioVm0fCkdJgQyRbewiqp7Jp/z5dqpseYRAoGBALe1jmeXZ3bIzbq33EO+pc3NIQODhpDiRsZJfrneH7tm4N2UWp8vBKBqjwmMxFO4LMPxH0amnhtLvq0cOCgVyN9zekTWtIuyOw9KKfrmJ3zfRY1oRV2Fn+h6dWIveWj1hm0H6yv5xznaUuNzlRubXshWyC/eyMPAUatYrf5tKYhTAoGAMt5/GcDcyPz7KSlRMNlur1nT8j9cP5bjkiOR7139EVV89wVZr1yAXJSj/XcvpIpzPC0tY2RzpjfUIbjDxiAUHvKuuXIINdSmJZJ4tQngRyae7b/FW27J6UCbLgIUMUbLYjQSDPQZSZ97HO2Zmu5KY+HeMdtzgiFsLwjfO+AaLDECgYAO9SFbHeC2szLM+RteCK/HSeRePN8//Kx2iJVg3M0InR/B6spWG6XsycBLrsJtbpl2erNpNTe6UTh9L8cCvINWbjiOUkzw8toMLKWuX/7nE+a91LeRHcgfTZkxHVxtR1BioDptojCubTBChK6nSMc22JoEC8ec6JO9t8Ky7IBtMQKBgQDWIihg/WYVZh6a7LQ2LayHJ39JvOUhOPUK0LN3hxlUnIiJWczJf41it8c/ooKmrFMGh3Nc9P42wqdsRQrnt1de3otGNQmAgrO65QZbOvr7hhSp6znb6d+TytUeiYdFC/xmBbQoZ6Fz3r72T36VWuRatULkYrOAGTKlwtWKD3oByQ==-----END RSA PRIVATE KEY-----";
            string postPayload = "{\"publicKey\": \"" + publicKeyHeader + "\", \"otpcode\": \"123456\"}";

            long currentTimestamp = (long)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

            var payload = JsonConvert.SerializeObject(new SignaturePayload
            {
                PublicKey = publicKeyHeader,
                Timestamp = currentTimestamp,
                PostPayload = postPayload
            }, Formatting.None);

            var payloadBytes = Encoding.UTF8.GetBytes(payload);

            // Perform the signature calculation using the appropriate private key
            var signature = SignPayload(privateKey, payloadBytes);
            var signatureHeader = Convert.ToBase64String(signature);

            var logger = new Mock<ILogger<SignatureVerificationMiddleware>>();

            var context = new DefaultHttpContext();
            context.Request.Headers["x-public-key"] = publicKeyHeader;
            context.Request.Headers["x-signature"] = signatureHeader;

            var requestStream = new MemoryStream(Encoding.UTF8.GetBytes(postPayload));
            context.Request.Body = requestStream;
            context.Request.Method = "POST";

            var next = new RequestDelegate(innerContext => Task.CompletedTask);
            var middleware = new SignatureVerificationMiddleware(next, logger.Object);

            // Act
            await middleware.Invoke(context);

            // Assert
            Assert.AreEqual(200, context.Response.StatusCode);
        }

        [TestMethod]
        public async Task Middleware_InvalidSignature_ReturnsForbidden()
        {
            // Arrange
            var publicKeyHeader = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnLQKInx7UeHsc99RPHHTdBs5jQZoTOswJc6pE4+dggmbf4b/XKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHzd2ZPjyeakERGjS2ZKBCo1ysYnP0bROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s3hVLOzdLlHEisjTkHUsDJATg8J8EHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko+bVQxtv1/ZiGhDsWUPNGss1hXmXBQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZwRvezSnUfGcY0h/HG/TMs1EGfUecgI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+fgwIDAQAB-----END PUBLIC KEY-----";
            var privateKey = "-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAnLQKInx7UeHsc99RPHHTdBs5jQZoTOswJc6pE4+dggmbf4b/XKDxNrKCpHVXMKRrotGdHKv9xOMhJFHPyZHzd2ZPjyeakERGjS2ZKBCo1ysYnP0bROdoNAEbAIOyMutiTkYEuf/a7Rr5ptJQ323s3hVLOzdLlHEisjTkHUsDJATg8J8EHx/pRJD48+Q0LHkArhmbIKol4lDRe2ODfgko+bVQxtv1/ZiGhDsWUPNGss1hXmXBQCzx4VXgi6DfeTkn/GyyaonumVEkaR+KUKxZwRvezSnUfGcY0h/HG/TMs1EGfUecgI6bCsIv6lD5U4AMkHvt4e+dckRgSV5cnJ+fgwIDAQABAoIBAQCXZIl2D/XEghTDTblaQE4eGj9btBkIVyBJJoPK1jFB9K46Yt5LS2I/ie8VnBgEcpVa1FCJ5tBha14VjMTG5S7m5/1tPMHjJ1NSCf+x6YZ1erlo0k+KHldaBsdjk9iRwT9Uh+kBGeMUt78CIKbpdXYmiUQJjb6DR1pR+S957YK3REro6HWBhYwRAnPCukchaD6efaUN2yoqm/7gMy5avNFeJ+3VaR+RejylZd+IoGIAYRW7Lgu5x2g9SD1O2HaX/tfPj9ouz+5c8J2eciNnDqI8M78zhgpcFvgoFdHNL+UiSUEGen+ZCT9JiPNEH/AI2zxc8TtCjIpA0qJkJ/MxRP6BAoGBANpd9+wC/meOcsOPBZYra/vIc7Oo2OVOrdYZQQ89so2ZlbtSoPP69wN84d6M56oulApE4F4zdlgojSWo3S/4qN93ZptR1vuSIml7eAkH9BQJSnlHgFjftdF1zcXV4bSxnqkdZh5i77aioVm0fCkdJgQyRbewiqp7Jp/z5dqpseYRAoGBALe1jmeXZ3bIzbq33EO+pc3NIQODhpDiRsZJfrneH7tm4N2UWp8vBKBqjwmMxFO4LMPxH0amnhtLvq0cOCgVyN9zekTWtIuyOw9KKfrmJ3zfRY1oRV2Fn+h6dWIveWj1hm0H6yv5xznaUuNzlRubXshWyC/eyMPAUatYrf5tKYhTAoGAMt5/GcDcyPz7KSlRMNlur1nT8j9cP5bjkiOR7139EVV89wVZr1yAXJSj/XcvpIpzPC0tY2RzpjfUIbjDxiAUHvKuuXIINdSmJZJ4tQngRyae7b/FW27J6UCbLgIUMUbLYjQSDPQZSZ97HO2Zmu5KY+HeMdtzgiFsLwjfO+AaLDECgYAO9SFbHeC2szLM+RteCK/HSeRePN8//Kx2iJVg3M0InR/B6spWG6XsycBLrsJtbpl2erNpNTe6UTh9L8cCvINWbjiOUkzw8toMLKWuX/7nE+a91LeRHcgfTZkxHVxtR1BioDptojCubTBChK6nSMc22JoEC8ec6JO9t8Ky7IBtMQKBgQDWIihg/WYVZh6a7LQ2LayHJ39JvOUhOPUK0LN3hxlUnIiJWczJf41it8c/ooKmrFMGh3Nc9P42wqdsRQrnt1de3otGNQmAgrO65QZbOvr7hhSp6znb6d+TytUeiYdFC/xmBbQoZ6Fz3r72T36VWuRatULkYrOAGTKlwtWKD3oByQ==-----END RSA PRIVATE KEY-----";
            string postPayload = "{\"publicKey\": \"" + publicKeyHeader + "\", \"otpcode\": \"123456\"}";
            var currentTimestamp = (long)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

            var payload = JsonConvert.SerializeObject(new SignaturePayload
            {
                PublicKey = publicKeyHeader,
                Timestamp = currentTimestamp,
                PostPayload = postPayload
            }, Formatting.None);

            var payloadBytes = Encoding.UTF8.GetBytes(payload);

            // Perform the signature calculation using a different private key
            var invalidPrivateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpQIBAAKCAQEAqZCXUB2rBjtIMIsl/2kn5jz/5/REnCSmlBdEwoYghl0wsDxI\r\nihdUD4zuOY+yzGjVCryVo7/5hTd4FxyfiAgKFE9UwORr0c4qDYNYwZpkjKF5Ri0t\r\nd0j1z6nfe63DazuijiNtPNyi0mhRKtkU32Fjz1U+mb8L09kwjk4qPSnfdlcibkRq\r\nEUsJvmzvB7BrNsDtONfLIaMSDuSt0FcAQcf+HQbr3UcnQfBuDZ4q1C1xbmWH/ojV\r\n9MR6OVsQCvsBuvAl1vYWaIAiZto4n26Cx8eMCKyxAVS53mzVq300hO44YlJet1vi\r\nbZRdAT9LAlTlk4hPC2w+M5Paht5/jrV7zoLxMQIDAQABAoIBAQCDSRY+y5m9S20L\r\nWNFkvdBMrXId77yngKERDCsKybqpDcJC0YoAkStelulj2+S963T3ySe7D0psYJQ0\r\noM7MDh1vuDSQ3Mq2OP/KUqYH0DiFwggZ06TeNLlNveLw6YrinduwXbGYa+QNMQOX\r\nP1iv08Hpp8C+XXMU5ZZ4uABwNtlzz6DVnI51vsdmCX5zdnVeNxWEZb4qWX4zs43Q\r\n2ujld0kr9xOyuGmMHnGKRg/LZ2hWpgMKeAl2JIy5iPRpKw7EXPdbkFkJIk9Wme9J\r\nx14gutYNFIg9xjGVeC6zqEnwCfIANNHxXCvC9HnV5xmK9FtgyRCcDZKVWYz1+sLf\r\nSjzUp/R5AoGBAPKMWnCX6ttDo2XTZ1hdwPm3iHH0s2UTVoWBKHC7FSS4+m81cvSq\r\nlfjJgLzCPIhxaVBhmRERC1BLMs/1MAPTvY7I3ayet3/fgzSyZUqtwf6LDRdVP7CV\r\nOYb6VmNV1UfOPK5X7bnylrWWI8huq2+fGzUNQQP1vgN2HHgOGtISf9JbAoGBALL4\r\nCO5aZwbuiciBdhUDf2mnk3HV7fzkN781A6C6aQkkRu5xyO9/l0DsnT4xyjmwmaWl\r\nGBw9ciJSYqnCgrcxiK57YmwZ/AMZE8OpmXhQyWkqjCEnD2D9/7cL2RVz+WCRykN1\r\nJNtYROCMKySGdE24Gre1RAvcr4QGZYmlcrw5sUhjAoGAEXBV8FJ76Ffsn52biJb1\r\nEP9JKChX3aSOS/sFVVWeJ43FM8m8AithrQmP4AJ3J7g/wi/COZ/oGFXPyXPvh9bp\r\ngiKfDZI7z03auSc6cSwdDpgg0NSoR6HzCOlm3K2HMCp74m0gAoaWn2e0Gu0aFmRy\r\nKFZTnl1E1Crh0R/yfbgmyJECgYEAsCD8IR7k/+RnwuTtwdZ0YRVjPQettFEhL9LL\r\npDVwQ2fpSqa+ej0WLPXv9hJoE4hiXatxY/FwzqhHowvjOsjL2/NftEWKR745Pjk9\r\n6TOQVChkSgg30VuHeqx1UvCUvt4bsXGq+RcQifBIUSTldss1uA/zTL0+Gm91JBao\r\nKOeaOkMCgYEAi5GnO/+PLsysqpiUSbAi91Rp+MEELQHqhak6jp6v7hpxlkTYrJub\r\nxPXyODuyK1iX2TfUj8h2c4WiWzUIXiAT4+6mB8w+AdTivYl+HX350ONatZM5p75m\r\n1E1zzSUo9OkHg26kAZaDM130hdv9OsrhiiDybd4yfyHv+9XV3Yool9c=\r\n-----END RSA PRIVATE KEY-----";
            var invalidSignature = SignPayload(invalidPrivateKey, payloadBytes);
            var signatureHeader = Convert.ToBase64String(invalidSignature);

            var context = new DefaultHttpContext();
            context.Request.Headers["x-public-key"] = publicKeyHeader;
            context.Request.Headers["x-signature"] = signatureHeader;
            context.Request.Method = "POST";

            context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(postPayload));

            var logger = new Mock<ILogger<SignatureVerificationMiddleware>>();

            var next = new RequestDelegate(innerContext => Task.CompletedTask);
            var middleware = new SignatureVerificationMiddleware(next, logger.Object);

            // Act
            await middleware.Invoke(context);

            // Assert
            Assert.AreEqual(403, context.Response.StatusCode); // Forbidden status code
        }


        // Helper method to sign the payload using the private key
        private static byte[] SignPayload(string privateKey, byte[] payload)
        {
            using (RSA rsa = RSA.Create())
            {
                rsa.ImportFromPem(privateKey);

                return rsa.SignData(payload, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
            }
        }
    }
}
