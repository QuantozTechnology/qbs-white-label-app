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
