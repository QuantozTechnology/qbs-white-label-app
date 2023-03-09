// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Infrastructure.Nexus.SigningService
{
    public interface ISigningService
    {
        public Task<string> GenerateKeyPair(Blockchain blockchain);

        public Task<string> Sign(SignRequest request);
    }

    public record SignRequest(Blockchain Blockchain, string PublicKey, string TransactionEnvelope);
}
