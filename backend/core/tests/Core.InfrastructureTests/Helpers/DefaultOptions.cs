using Core.Infrastructure.Nexus;

namespace Core.InfrastructureTests.Helpers
{
    public static class DefaultOptions
    {
        public static TokenOptions TokenOptions = new TokenOptions
        {
            Blockchain = Blockchain.STELLAR,
            CustomerTokens = new string[] { "SCEUR" }
        };
    }
}
