// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
using Web.Portal;

namespace Core.API.DependencyInjection
{
    public class ConfigOptions
    {
        [Required]
        public required PortalOptions Portal { get; set; }
    }

    public static class ConfigInjection
    {
        public static IServiceCollection AddConfig(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<ConfigOptions>()
              .Bind(configuration.GetSection("ConfigOptions"))
              .ValidateDataAnnotationsRecursively()
              .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<ConfigOptions>>().Value);

            return services;
        }
    }
}
