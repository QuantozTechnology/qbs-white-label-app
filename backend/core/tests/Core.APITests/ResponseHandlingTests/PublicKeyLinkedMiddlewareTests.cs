// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.API.ResponseHandling;
using Core.Domain.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authentication;

namespace Core.APITests.ResponseHandlingTests;

[TestClass]
public class PublicKeyLinkedMiddlewareTests : IDisposable
{
    private IHost host = default!;
    private HttpClient client = default!;

    [TestInitialize]
    public async Task Init()
    {
        host = await new HostBuilder()
            .ConfigureWebHost(webBuilder =>
            {
                webBuilder
                    .UseTestServer()
                    .ConfigureServices(services =>
                    {
                        services.AddRouting();
                        services.AddTransient<ICustomerDeviceRepository, FakeCustomerDeviceRepository>();

                        // add claims to user identity - this is the user that will be authenticated
                        services.AddAuthentication("Test")
                            .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", op => { });
                        services.AddAuthorization();
                    })
                    .Configure(app =>
                    {
                        app.UseRouting();
                        app.UseAuthentication();

                        // add the middleware after authentication to have access to the user object and its claims
                        app.UseMiddleware<PublicKeyLinkedMiddleware>();
                        app.UseAuthorization();

                        app.UseEndpoints(endpoints =>
                        {
                            // map an endpoint that verifies the public key with the authenticated user
                            endpoints.Map("/verify", async context =>
                                {
                                    await context.Response.WriteAsync($"Hello World {context.User.Identity.Name}!");
                                })
                                .RequireAuthorization()
                                .WithName("NotInTheIgnoreList");

                            // map an endpoint that ignores the public key verification (hardcoded list) through the name
                            endpoints.Map("/ignore", async context =>
                                {
                                    await context.Response.WriteAsync($"Hello World {context.User.Identity.Name}!");
                                })
                                .RequireAuthorization()
                                .WithName("DeviceAuthentication");
                        });
                    });
            })
            .StartAsync();

        client = host.GetTestClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");
    }

    void IDisposable.Dispose()
    {
        host.Dispose();
        client.Dispose();
    }

    [TestMethod]
    public async Task Verify_Returns_Forbidden()
    {
        var response = await client.GetAsync("/verify");

        var responseString = await response.Content.ReadAsStringAsync();
        Assert.AreEqual("Public key not linked to user",
            responseString);
        Assert.AreEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [TestMethod]
    public async Task Verify_Returns_Ok()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "/verify");
        request.Headers.Add("x-public-key", "VALID-PUBKEY");
        var response = await client.GetAsync("/verify");

        var responseString = await response.Content.ReadAsStringAsync();
        Assert.AreEqual("Public key not linked to user",
            responseString);
        Assert.AreEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [TestMethod]
    public async Task IgnoreEndpoint_Returns_Ok()
    {
        // send request
        var response = await client.GetAsync("/ignore");

        var responseString = await response.Content.ReadAsStringAsync();
        Assert.AreEqual($"Hello World TestUser!", responseString);
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
    }
}