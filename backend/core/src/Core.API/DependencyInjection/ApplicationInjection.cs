// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Pipelines;
using Core.Domain;
using FluentValidation;
using MediatR;

namespace Core.API.DependencyInjection
{
    public static class ApplicationInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ComplianceBehaviour<,>));

            services.AddValidatorsFromAssembly(Application.AssemblyReference.Assembly);
            services.AddMediatR(Application.AssemblyReference.Assembly);

            services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();

            return services;
        }

    }
}
