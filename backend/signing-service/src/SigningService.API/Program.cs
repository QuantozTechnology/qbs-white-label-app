// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SigningService.API.BLL;
using SigningService.API.Data;
using SigningService.API.Repository;
using System;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        var cs = Environment.GetEnvironmentVariable("SigningDbContext");

        if (cs == null)
        {
            throw new Exception("Database connection string is required");
        }

        services.AddDbContext<SigningDbContext>(options => options.UseSqlServer(cs));

        services.AddOptions<WalletOptions>()
            .Configure<IConfiguration>((settings, configuration) =>
            {
                configuration.GetSection("WalletOptions").Bind(settings);
            });

        services.AddScoped<ISigningPairRepository, SigningPairRepository>();
        services.AddScoped<ISigningPairLogic, SigningPairLogic>();
        services.AddScoped<IWallet, KeyVaultWallet>();
    })
    .Build();

await host.RunAsync();