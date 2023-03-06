using Microsoft.AspNetCore.Cors.Infrastructure;

namespace Core.API.DependencyInjection
{
    public class CORSOptions
    {
        public string[]? AllowedOrigins { get; set; }

        public string[]? AllowedHeaders { get; set; }

        public string[]? AllowedMethods { get; set; }
    }

    public static class CORSInjection
    {
        public static IServiceCollection AddCORSPolicy(this IServiceCollection services, IConfiguration configuration,
            string policyName, string configSection = "CORSOptions")
        {
            var corsOptions = configuration.GetRequiredSection(configSection).Get<CORSOptions>();

            if (corsOptions != null)
            {
                // default is allow all
                var policyBuilder = new CorsPolicyBuilder()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin();

                if (corsOptions.AllowedOrigins != null && corsOptions.AllowedOrigins.Any())
                {
                    policyBuilder.WithOrigins(corsOptions.AllowedOrigins);
                }

                if (corsOptions.AllowedHeaders != null && corsOptions.AllowedHeaders.Any())
                {
                    policyBuilder.WithHeaders(corsOptions.AllowedHeaders);
                }

                if (corsOptions.AllowedMethods != null && corsOptions.AllowedMethods.Any())
                {
                    policyBuilder.WithMethods(corsOptions.AllowedMethods);
                }

                services.AddCors(options => options.AddPolicy(policyName, policyBuilder.Build()));
            }

            return services;
        }
    }
}
