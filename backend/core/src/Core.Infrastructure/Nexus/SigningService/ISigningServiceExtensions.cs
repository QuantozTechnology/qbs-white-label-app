// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Nexus.Token.SDK.Requests;
using Nexus.Token.SDK.Responses;

namespace Core.Infrastructure.Nexus.SigningService
{
    public static class ISigningServiceExtensions
    {
        public static async Task<AlgorandSubmitSignatureRequest[]> SignAlgorandTransactionAsync(this ISigningService signingService, string publicKey, SignableResponse signableResponse)
        {
            if (signableResponse.BlockchainResponse.RequiredSignatures == null)
            {
                throw new InvalidOperationException("Invalid blockchain response, are you using the correct key pair?");
            }

            var unsignedTransactions = signableResponse.BlockchainResponse.RequiredSignatures
                .Where(r => r.PublicKey == publicKey);

            var submitRequests = unsignedTransactions.Select(async unsignedTransaction =>
            {
                var encodedUnsignedTransaction = unsignedTransaction.EncodedTransaction;
                var hash = unsignedTransaction.Hash;

                var request = new SignRequest(Blockchain.ALGORAND, publicKey, encodedUnsignedTransaction);

                var encodedSignedTransaction = await signingService.Sign(request);
                return new AlgorandSubmitSignatureRequest(hash, publicKey, encodedSignedTransaction);
            });

            return await Task.WhenAll(submitRequests);
        }

        public static async Task<StellarSubmitSignatureRequest[]> SignStellarTransactionEnvelopeAsync(this ISigningService signingService, string publicKey, SignableResponse signableResponse)
        {
            if (signableResponse.BlockchainResponse.RequiredSignatures == null)
            {
                throw new InvalidOperationException("Invalid blockchain response, are you using the correct key pair?");
            }

            var unsignedTransactions = signableResponse.BlockchainResponse.RequiredSignatures
                .Where(r => r.PublicKey == publicKey);

            var submitRequests = unsignedTransactions.Select(async unsignedTransaction =>
            {
                var encodedUnsignedTransaction = unsignedTransaction.EncodedTransaction;
                var hash = unsignedTransaction.Hash;

                var request = new SignRequest(Blockchain.STELLAR, publicKey, encodedUnsignedTransaction);
                var encodedSignedTransaction = await signingService.Sign(request);

                return new StellarSubmitSignatureRequest(hash, publicKey, encodedSignedTransaction);
            });

            return await Task.WhenAll(submitRequests);
        }

        public static async Task<StellarSubmitSignatureRequest[]> SignStellarTransactionEnvelopeAsync(this ISigningService signingService, IEnumerable<string> publicKeys, SignableResponse signableResponse)
        {
            if (signableResponse.BlockchainResponse.RequiredSignatures == null)
            {
                throw new InvalidOperationException("Invalid blockchain response, are you using the correct key pair?");
            }

            var unsignedTransactions = signableResponse.BlockchainResponse.RequiredSignatures
                .Where(r => publicKeys.Contains(r.PublicKey))
                .ToList();

            var submitRequests = new List<Task<StellarSubmitSignatureRequest>>();

            Parallel.ForEach(unsignedTransactions, async unsignedTransaction =>
            {
                var encodedUnsignedTransaction = unsignedTransaction.EncodedTransaction;
                var hash = unsignedTransaction.Hash;

                var request = new SignRequest(Blockchain.STELLAR, unsignedTransaction.PublicKey, encodedUnsignedTransaction);
                var encodedSignedTransaction = await signingService.Sign(request);

                var submitRequest = new StellarSubmitSignatureRequest(hash, unsignedTransaction.PublicKey, encodedSignedTransaction);

                lock (submitRequests)
                {
                    submitRequests.Add(Task.FromResult(submitRequest));
                }
            });

            await Task.WhenAll(submitRequests);

            return submitRequests.Select(t => t.Result).ToArray();
        }
    }
}
