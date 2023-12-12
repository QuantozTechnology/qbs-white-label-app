// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Core.Domain.Repositories;
using Core.Infrastructure.Compliance;
using Core.Infrastructure.Compliance.IPLocator;
using Core.Infrastructure.Compliance.Sanctionlist;
using Core.Infrastructure.Compliance.SendGridMailService;
using Core.Infrastructure.CustomerFileStorage;
using Core.Infrastructure.Jobs;
using Core.Infrastructure.Nexus;
using Core.Infrastructure.Nexus.Repositories;
using Core.Infrastructure.Nexus.SigningService;
using Microsoft.Extensions.Options;
using Nexus.Sdk.Shared.Http;
using Nexus.Sdk.Token.Extensions;
using Quartz;

namespace Core.API.DependencyInjection
{
    public static class InfrastructureInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddNexus(configuration)
                .AddIPLocator(configuration)
                .AddSanctionlist(configuration)
                .AddSigningService(configuration)
                .AddBlobStorage(configuration)
                .AddCompliance(configuration)
                .AddTOTPGenerator()
                .AddSendGridMailService(configuration)
                .AddBackgroundJobs(configuration);

            return services;
        }

        private static IServiceCollection AddNexus(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<TokenOptions>()
               .Bind(configuration.GetSection("TokenOptions"))
               .ValidateDataAnnotationsRecursively()
               .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<TokenOptions>>().Value);

            services.AddTokenServer(configuration);

            services.AddScoped<ICustomerRepository, NexusCustomerRepository>();
            services.AddScoped<IAccountRepository, NexusAccountRepository>();
            services.AddScoped<ITransactionRepository, NexusTransactionRepository>();
            services.AddScoped<ISettingsRepository, NexusSettingsRepository>();
            services.AddScoped<IMailsRepository, NexusMailsRepository>();

            return services;
        }

        private static IServiceCollection AddIPLocator(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<IPServiceOptions>()
                .Bind(configuration.GetSection("IPLocatorOptions"))
                .ValidateDataAnnotationsRecursively()
                .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<IPServiceOptions>>().Value);

            services.AddScoped<IIPLocator, IPLocator>();
            services.AddHttpClient<IIPLocator, IPLocator>(client =>
            {
                var baseUrl = configuration.GetValue<string>("IPLocatorOptions:BaseUrl");

                if (string.IsNullOrWhiteSpace(baseUrl))
                {
                    throw new Exception("IPLocator `BaseUrl` setting is required");
                }

                client.BaseAddress = new Uri(baseUrl);
            });

            return services;
        }

        private static IServiceCollection AddSanctionlist(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<SanctionlistOptions>()
                .Bind(configuration.GetSection("SanctionlistOptions"))
                .ValidateDataAnnotationsRecursively()
                .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<SanctionlistOptions>>().Value);

            services.AddScoped<ISanctionlist, Sanctionlist>();
            services.AddHttpClient<ISanctionlist, Sanctionlist>(client =>
            {
                var baseUrl = configuration.GetValue<string>("SanctionlistOptions:BaseUrl");

                if (string.IsNullOrWhiteSpace(baseUrl))
                {
                    throw new Exception("Sanctionlist `BaseUrl` setting is required");
                }

                client.BaseAddress = new Uri(baseUrl);
            })
            .AddHttpMessageHandler<NexusIdentityHandler>();

            return services;
        }

        private static IServiceCollection AddCompliance(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<ComplianceOptions>()
                .Bind(configuration.GetSection("ComplianceOptions"))
                .ValidateDataAnnotationsRecursively()
                .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<ComplianceOptions>>().Value);
            services.AddScoped<IComplianceService, ComplianceService>();

            return services;
        }

        private static IServiceCollection AddSigningService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<SigningServiceOptions>()
              .Bind(configuration.GetSection("SigningServiceOptions"))
              .ValidateDataAnnotationsRecursively()
              .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<SigningServiceOptions>>().Value);

            services.AddSingleton<ISigningService, SigningService>();
            services.AddHttpClient<ISigningService, SigningService>(client =>
            {
                var baseUrl = configuration.GetValue<string>("SigningServiceOptions:BaseUrl");

                if (string.IsNullOrWhiteSpace(baseUrl))
                {
                    throw new Exception("Signing Service `BaseUrl` setting is required");
                }

                client.BaseAddress = new Uri(baseUrl);
            });

            return services;
        }

        private static IServiceCollection AddBlobStorage(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<BlobStorageOptions>()
                .Bind(configuration.GetSection("BlobStorageOptions"))
                .ValidateDataAnnotationsRecursively()
                .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<BlobStorageOptions>>().Value);

            services.AddScoped<ICustomerFileStorage, BlobStorage>();

            return services;
        }

        private static IServiceCollection AddTOTPGenerator(this IServiceCollection services)
        {
            services.AddSingleton<ICustomerOTPGenerator, TOTPGenerator>();

            return services;
        }

        private static IServiceCollection AddSendGridMailService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<SendGridMailServiceOptions>()
              .Bind(configuration.GetSection("SendGridMailServiceOptions"))
              .ValidateDataAnnotationsRecursively()
              .ValidateOnStart();

            services.AddSingleton(sp => sp.GetRequiredService<IOptions<SendGridMailServiceOptions>>().Value);

            services.AddSingleton<ISendGridMailService, SendGridMailService>();

            return services;
        }

        public static IServiceCollection AddBackgroundJobs(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddQuartz(q =>
            {
                q.UseMicrosoftDependencyInjectionJobFactory();

                // Register the ProcessCallbacksJob, loading the schedule from configuration
                q.AddJobAndTrigger<ProcessCallbacksJob>(configuration);

                // Register the ProcessPaymentRequestsJob, loading the schedule from configuration
                q.AddJobAndTrigger<ProcessExpiredPaymentRequestJob>(configuration);

                // Register the ProcessEmailsJob, loading the schedule from configuration
                q.AddJobAndTrigger<ProcessEmailsJob>(configuration);
            });

            services.AddQuartzHostedService(opt =>
            {
                opt.WaitForJobsToComplete = true;
            });

            return services;
        }

        public static void AddJobAndTrigger<T>(this IServiceCollectionQuartzConfigurator quartz, IConfiguration config) where T : IJob
        {
            // Use the name of the IJob as the appsettings.json key
            string jobName = typeof(T).Name;

            // Try and load the schedule from configuration
            var configKey = $"Quartz:{jobName}";
            var cronSchedule = config[configKey];

            // Some minor validation
            if (string.IsNullOrEmpty(cronSchedule))
            {
                throw new Exception($"No Quartz.NET Cron schedule found for job in configuration at {configKey}");
            }

            // register the job as before
            var jobKey = new JobKey(jobName);
            quartz.AddJob<T>(opts => opts.WithIdentity(jobKey));

            quartz.AddTrigger(opts => opts
                .ForJob(jobKey)
                .WithIdentity(jobName + "-trigger")
                .WithCronSchedule(cronSchedule)); // use the schedule from configuration
        }
    }
}
