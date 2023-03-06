namespace Core.Infrastructure.Nexus
{
    public enum Blockchain
    {
        STELLAR = 1,
        ALGORAND = 2
    }

    public enum Direction
    {
        Incoming = 1,
        Outgoing = 2
    }

    public enum NexusErrorCodes
    {
        ExistingProperty = 1,
        AccountNotFoundError = 2,
        CustomerNotFoundError = 3,
        TrustlevelNotFoundError = 4,
        InvalidStatus = 4,
        InvalidProperty = 5,
        TransactionNotFoundError = 6
    }
}
