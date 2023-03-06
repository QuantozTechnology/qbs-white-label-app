using Core.Domain.Exceptions;

namespace Core.Infrastructure.Nexus
{
    internal class Helpers
    {
        public static string ToNexusAccountCode(Blockchain blockchain, string publicKey) => blockchain switch
        {
            Blockchain.STELLAR => $"XLM-{publicKey}",
            Blockchain.ALGORAND => $"ALGO-{publicKey}",
            _ => throw new CustomErrorsException("NexusSDKError", blockchain.ToString(), "Blockchain not supported")
        };
    }
}
