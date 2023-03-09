// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
