namespace Core.Infrastructure.Nexus.SigningService
{
    public interface ISigningService
    {
        public Task<string> GenerateKeyPair(Blockchain blockchain);

        public Task<string> Sign(SignRequest request);
    }

    public record SignRequest(Blockchain Blockchain, string PublicKey, string TransactionEnvelope);
}
