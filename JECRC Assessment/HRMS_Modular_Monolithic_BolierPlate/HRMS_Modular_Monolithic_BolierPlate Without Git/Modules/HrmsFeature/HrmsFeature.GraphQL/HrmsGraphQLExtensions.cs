using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HrmsFeature.GraphQL
{
    public static class HrmsGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddHrmsGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<HrmsQuery>()
                .AddTypeExtension<HrmsMutation>();
        }
    }
}
