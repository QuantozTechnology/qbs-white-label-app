// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Nexus.Sdk.Token.Requests;
using Nexus.Sdk.Token.Responses;

namespace Core.Infrastructure.Nexus.SigningService
{
    public static class ISigningServiceExtensions
    {
        public static Task<AlgorandSubmitSignatureRequest[]> SignAlgorandTransactionAsync(this ISigningService signingService, string publicKey, SignableResponse signableResponse)
        {
            if (signableResponse.BlockchainResponse.RequiredSignatures == null)
            {
                throw new InvalidOperationException("No Algorand transactions to sign");
            }

            var unsignedTransactions = signableResponse.BlockchainResponse.RequiredSignatures
                .Where(r => r.PublicKey == publicKey)
                .ToList();

            var submitRequests = unsignedTransactions.Select(async unsignedTransaction =>
            {
                var encodedUnsignedTransaction = unsignedTransaction.EncodedTransaction;
                var hash = unsignedTransaction.Hash;

                var signRequest = new SignRequest(Blockchain.ALGORAND, publicKey, encodedUnsignedTransaction);
                var encodedSignedTransaction = await signingService.Sign(signRequest);

                return new AlgorandSubmitSignatureRequest(hash, publicKey, encodedSignedTransaction);
            });

            return Task.FromResult(submitRequests.Select(t => t.Result).ToArray());
        }

        public static Task<StellarSubmitSignatureRequest[]> SignStellarTransactionEnvelopeAsync(this ISigningService signingService, string publicKey, SignableResponse signableResponse)
        {
            if (signableResponse.BlockchainResponse.RequiredSignatures == null)
            {
                throw new InvalidOperationException("No Stellar transactions to sign");
            }

            var unsignedTransactions = signableResponse.BlockchainResponse.RequiredSignatures
                .Where(r => r.PublicKey == publicKey)
                .ToList();

            var submitRequests = unsignedTransactions.Select(async unsignedTransaction =>
            {
                var encodedUnsignedTransaction = unsignedTransaction.EncodedTransaction;
                var hash = unsignedTransaction.Hash;

                var signRequest = new SignRequest(Blockchain.STELLAR, publicKey, encodedUnsignedTransaction);
                var encodedSignedTransaction = await signingService.Sign(signRequest);

                return new StellarSubmitSignatureRequest(hash, publicKey, encodedSignedTransaction);
            });

            return Task.FromResult(submitRequests.Select(t => t.Result).ToArray());
        }
    }
}
