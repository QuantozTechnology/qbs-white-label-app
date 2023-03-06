using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SigningService.API;
using SigningService.API.BLL;
using SigningService.API.Data;
using SigningService.API.Repository;
using System;

[assembly: WebJobsStartup(typeof(Startup))]
namespace SigningService.API;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        var cs = Environment.GetEnvironmentVariable("SigningDbContext");

        if (cs == null)
        {
            throw new Exception("Database connection string is required");
        }

        builder.Services.AddDbContext<SigningDbContext>(options => options.UseSqlServer(cs));

        builder.Services.AddOptions<WalletOptions>()
            .Configure<IConfiguration>((settings, configuration) =>
            {
                configuration.GetSection("WalletOptions").Bind(settings);
            });

        builder.Services.AddScoped<ISigningPairRepository, SigningPairRepository>();
        builder.Services.AddScoped<ISigningPairLogic, SigningPairLogic>();
        builder.Services.AddScoped<IWallet, KeyVaultWallet>();
    }
}