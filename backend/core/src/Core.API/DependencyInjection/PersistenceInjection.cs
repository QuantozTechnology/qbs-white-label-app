// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Repositories;
using Core.Persistence.Repositories;
using Core.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Core.API.DependencyInjection
{
    public static class PersistenceInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            var cs = configuration.GetConnectionString("Database");

            if (string.IsNullOrWhiteSpace(cs))
            {
                throw new Exception("`ConnectionString:Database` setting is required");
            }

            var assembly = Persistence.AssemblyReference.Assembly.GetName().Name;
            services.AddDbContext<DatabaseContext>(options => options.UseSqlServer(cs, x => x.MigrationsAssembly("Core.API")));

            services.AddScoped<IPaymentRequestRepository, PaymentRequestRepository>();
            services.AddScoped<ICallbackRepository, CallbackRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<ICustomerDeviceRepository, CustomerDeviceRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
