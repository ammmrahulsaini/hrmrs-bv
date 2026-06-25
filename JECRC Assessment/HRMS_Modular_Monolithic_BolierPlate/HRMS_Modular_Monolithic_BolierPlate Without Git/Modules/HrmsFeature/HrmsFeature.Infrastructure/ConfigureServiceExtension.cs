using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace HrmsFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddHrmsDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, HrmsEntityConfigurator>());
            return services;
        }

        public static void SeedHrmsData(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<PostgresDbContext>();
            HrmsSeeder.Seed(context);
        }
    }
}
