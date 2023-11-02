// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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

    public enum MailStatus
    {
        ReadyToSend = 1
    }
}
