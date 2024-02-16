// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

﻿using Core.Domain.Repositories;
using System.Net;
using System.Security.Claims;
using System.Security.Principal;

namespace Core.API.ResponseHandling;

/// <summary>
/// Verifies if the public key supplied in the header is linked to the user.
/// The user is determined by the NameIdentifier claim (CustomerCode) in the request.
/// </summary>
public class PublicKeyLinkedMiddleware
{
    private readonly ICustomerDeviceRepository _customerDeviceRepository;
    private readonly RequestDelegate _next;

    public PublicKeyLinkedMiddleware(
        ICustomerDeviceRepository customerDeviceRepository,
        RequestDelegate next)
    {
        _customerDeviceRepository = customerDeviceRepository;
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        // skip the middleware for specific endpoints
        if (!SkipEndpoint(context))
        {
            var userId = GetUserId(context.User);
            var pubKey = context.Request.Headers["x-public-key"];

            // get all public keys linked to the user
            var customerDevices = await _customerDeviceRepository.GetAsync(userId, context.RequestAborted);

            // if the user does not have any public keys or the public key is not linked to the user, return forbidden
            if (customerDevices is null
                || customerDevices.PublicKeys.All(keys => keys.PublicKey != pubKey))
            {
                // TODO: make this a custom error

                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                await context.Response.WriteAsync("Public key not linked to user");
                return;
            }
        }

        // safe to continue
        await _next(context);
    }

    /// <summary>
    /// Extract the user id from the claims
    /// </summary>
    private static string GetUserId(IPrincipal user)
    {
        if (user.Identity is not ClaimsIdentity identity)
        {
            throw new Exception($"Identity is not of type ClaimsIdentity");
        }

        var claim = identity.FindFirst(ClaimTypes.NameIdentifier);

        return claim is null
            ? throw new Exception($"{ClaimTypes.NameIdentifier} not found in claims")
            : claim.Value;
    }

    /// <summary>
    /// Skip the middleware for specific endpoints
    /// </summary>
    private static bool SkipEndpoint(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        var endpointName = endpoint?.Metadata.GetMetadata<EndpointNameMetadata>()?.EndpointName;

        var excludeList = new[] { "DeviceAuthentication" };

        return context.Request.Path.StartsWithSegments("/health")
               || excludeList.Contains(endpointName);
    }
}
