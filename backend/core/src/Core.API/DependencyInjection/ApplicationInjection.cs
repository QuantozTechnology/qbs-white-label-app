using Core.Application.Pipelines;
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

            return services;
        }

    }
}
