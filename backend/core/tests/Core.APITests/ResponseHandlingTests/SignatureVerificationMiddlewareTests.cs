// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.API.ResponseHandling;
using Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NSec.Cryptography;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace Core.APITests.ResponseHandlingTests.SignatureVerificationMiddlewareTests;

[TestClass]
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

    public record MessageObject(string Message);

    [TestMethod]
    public async Task VerifySignatureMiddleware_Successful_HttpProcessing()
    {
        using var host = await new HostBuilder()
            .ConfigureWebHost(webBuilder =>
            {
                webBuilder
                    .UseTestServer()
                    .ConfigureServices(services =>
                    {
                        services.AddSingleton<IDateTimeProvider>(
                            new StaticDateTimeProvider(
                                DateTimeOffset.FromUnixTimeSeconds(1577836800)));
                    })
                    .Configure(app =>
                    {
                        app.UseMiddleware<SignatureVerificationMiddleware>();

                        app.Run(async context =>
                        {
                            var msg = await context.Request.ReadFromJsonAsync<MessageObject>();
                            await context.Response.WriteAsync($"Hello World {msg.Message}!");
                        });
                    });
            })
            .StartAsync();

        var client = host.GetTestClient();

        // create get request
        var request = new HttpRequestMessage(HttpMethod.Post, "/");
        request.Content = new StringContent("{\"message\":\"HELLO\"}");
        request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        request.Headers.Add("x-timestamp", "1577836800");
        request.Headers.Add("x-signature", "ksnz8fzvQerq3uTgYYisKqLu/tZJWcYQYPW4UAl62FREqm6T9PDGiAIjwiePL6SC4jE7X59r8llhUQqgQKQ1DQ==");
        request.Headers.Add("x-public-key", "gwZ+LyQ+VLaIsWeSq3QFh+WaZHNgl07pXul++BsezoY=");

        // send request
        var response = await client.SendAsync(request);

        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);

        var responseString = await response.Content.ReadAsStringAsync();
        Assert.AreEqual("Hello World HELLO!", responseString);
    }

    [TestMethod]
    public async Task VerifySignatureMiddleware_Failed()
    {
        using var host = await new HostBuilder()
            .ConfigureWebHost(webBuilder =>
            {
                webBuilder
                    .UseTestServer()
                    .ConfigureServices(services =>
                    {
                        services.AddSingleton<IDateTimeProvider>(
                            new StaticDateTimeProvider(
                                DateTimeOffset.FromUnixTimeSeconds(1577836800)));
                    })
                    .Configure(app =>
                    {
                        app.UseMiddleware<SignatureVerificationMiddleware>();

                        app.Run(async context =>
                        {
                            var msg = await context.Request.ReadFromJsonAsync<MessageObject>();
                            await context.Response.WriteAsync($"Hello World {msg.Message}!");
                        });
                    });
            })
            .StartAsync();

        var client = host.GetTestClient();

        // create get request
        var request = new HttpRequestMessage(HttpMethod.Post, "/");
        request.Content = new StringContent("{\"message\":\"HELLO\"}");
        request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        request.Headers.Add("x-timestamp", "1577836801");
        request.Headers.Add("x-signature", "ksnz8fzvQerq3uTgYYisKqLu/tZJWcYQYPW4UAl62FREqm6T9PDGiAIjwiePL6SC4jE7X59r8llhUQqgQKQ1DQ==");
        request.Headers.Add("x-public-key", "gwZ+LyQ+VLaIsWeSq3QFh+WaZHNgl07pXul++BsezoY=");

        // send request
        var response = await client.SendAsync(request);

        Assert.AreEqual(HttpStatusCode.Forbidden, response.StatusCode);

        var responseString = await response.Content.ReadAsStringAsync();
        Assert.AreEqual("{\"Errors\":[{\"Code\":\"Forbidden\",\"Message\":\"Invalid signature\",\"Target\":\"x-signature\"}]}", responseString);
    }
}