// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;

namespace Core.API.DependencyInjection
{
    public class AzureB2COptions
    {
        [Required]
        public required string Issuer { get; set; }

        [Required]
        public required string Audience { get; set; }

    }

    public static class AuthInjection
    {
        public static IServiceCollection AddAuthenticationAndAuthorization(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAzureB2C(configuration);
            return services;
        }

        private static IServiceCollection AddAzureB2C(this IServiceCollection services, IConfiguration configuration)
        {
            var authSettings = configuration.GetRequiredSection("AzureB2COptions").Get<AzureB2COptions[]>();

            if (authSettings != null && authSettings.Any())
            {
                var builder = services.AddAuthentication(options => { options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme; });

                foreach (var authSetting in authSettings)
                {
                    builder.AddJwtBearer(authSetting.Issuer, jwtOptions =>
                    {
                        jwtOptions.Authority = authSetting.Issuer;
                        jwtOptions.Audience = authSetting.Audience;
                    });
                }

                services.AddAuthorization(options =>
                {
                    options.DefaultPolicy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .AddAuthenticationSchemes(authSettings.Select(auth => auth.Issuer).ToArray())
                        .Build();
                });

            }

            return services;
        }

    }

}
