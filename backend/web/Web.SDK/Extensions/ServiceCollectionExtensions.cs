// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.Extensions.DependencyInjection;
using Web.SDK;
using Web.SDK.Authorization;
using Web.SDK.Services;
using Web.SDK.Services.Interfaces;

namespace Web.SDK.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCoreAPI<TProviderImplementation>(this IServiceCollection services, Uri baseAddress) where TProviderImplementation : IAuthorizationProvider
        {
            services.AddHttpClient(Constants.CoreApiWithAuth, client =>
                {
                    client.BaseAddress = baseAddress;
                    client.DefaultRequestHeaders.Add("x-api-version", "1.0");
                })
                .AddHttpMessageHandler<CustomAuthorizationHandler>();

            services.AddHttpClient(Constants.CoreApiNoAuth, client =>
            {
                client.BaseAddress = baseAddress;
                client.DefaultRequestHeaders.Add("x-api-version", "1.0");
            });

            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IMerchantService, MerchantService>();

            services.AddScoped<CustomAuthorizationHandler>();
            services.AddScoped(typeof(IAuthorizationProvider), typeof(TProviderImplementation));

            return services;
        }
    }
}
