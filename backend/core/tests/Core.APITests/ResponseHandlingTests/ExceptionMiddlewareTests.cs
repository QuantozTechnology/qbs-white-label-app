// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.API.ResponseHandling;
using Core.Domain;
using Core.Domain.Exceptions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Hosting;
using System.Net;

namespace Core.APITests.ResponseHandlingTests;

[TestClass]
public class ExceptionMiddlewareTests
{
    /// <summary>
    /// When we throw a CustomErrorsException with ErrorCode = NotFoundKeyError, we should get a 409 response.
    /// This should allow the client to know that it should go for an "add additional device" flow
    /// </summary>
    [TestMethod]
    public async Task ExistingKey_Returns_Conflict()
    {
        using var host = await new HostBuilder()
            .ConfigureWebHost(webBuilder =>
            {
                webBuilder
                    .UseTestServer()
                    .Configure(app =>
                    {
                        app.ConfigureCustomExceptionMiddleware();

                        app.Run(context => throw new CustomErrorsException(DomainErrorCode.ExistingKeyError.ToString(), "TEST", "Verification needed."));
                    });
            })
            .StartAsync();

        var client = host.GetTestClient();

        // send request
        var response = await client.GetAsync("/");

        var responseString = await response.Content.ReadAsStringAsync();
        Assert.AreEqual("""{"Errors":[{"Code":"ExistingKeyError","Message":"Verification needed.","Target":"TEST"}]}""", responseString);
        Assert.AreEqual(HttpStatusCode.Conflict, response.StatusCode);
    }
}
