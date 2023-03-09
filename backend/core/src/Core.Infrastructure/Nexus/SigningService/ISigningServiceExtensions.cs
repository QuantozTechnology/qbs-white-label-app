// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Nexus.Token.SDK.Requests;
using Nexus.Token.SDK.Responses;

namespace Core.Infrastructure.Nexus.SigningService
{
    public static class ISigningServiceExtensions
    {
        public static async Task<AlgorandSubmitRequest[]> SignAlgorandTransactionAsync(this ISigningService signingService, string publicKey, SignableResponse signableResponse)
        {
            var algorandTransactions = signableResponse.BlockchainResponse.AlgorandTransactions;

            if (algorandTransactions == null || !algorandTransactions.Any())
            {
                throw new InvalidOperationException("No Algorand transactions to sign");
            }

            var algorandTransaction = algorandTransactions.First();
            var encodedTransaction = algorandTransaction.EncodedTransaction;

            var request = new SignRequest(Blockchain.ALGORAND, publicKey, encodedTransaction);
            var signedTransaction = await signingService.Sign(request);

            var submitRequest = new AlgorandSubmitRequest(algorandTransaction.Hash, publicKey, signedTransaction);
            return new AlgorandSubmitRequest[] { submitRequest };
        }

        public static async Task<StellarSubmitRequest> SignStellarTransactionEnvelopeAsync(this ISigningService signingService, string publicKey, SignableResponse signableResponse)
        {
            var encodedStellarEnvelope = signableResponse.BlockchainResponse.EncodedStellarEnvelope;

            if (encodedStellarEnvelope == null)
            {
                throw new InvalidOperationException("No Stellar transaction envelopes to sign");
            }

            var request = new SignRequest(Blockchain.STELLAR, publicKey, encodedStellarEnvelope);
            var signedTransactionEnvelope = await signingService.Sign(request);

            return new StellarSubmitRequest(signedTransactionEnvelope);
        }
    }
}
