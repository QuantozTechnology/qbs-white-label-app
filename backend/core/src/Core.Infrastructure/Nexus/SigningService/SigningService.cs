// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Exceptions;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Text.Json;

namespace Core.Infrastructure.Nexus.SigningService
{
    public class SigningService : ISigningService
    {
        private const string LABELPARTNERCODE = "QuantozPayments";

        private readonly HttpClient _httpClient;
        private readonly ILogger<SigningService> _logger;

        private readonly SigningServiceOptions _settings;

        public SigningService(
            ILogger<SigningService> logger,
            HttpClient httpClient,
            SigningServiceOptions settings)
        {
            _httpClient = httpClient;
            _logger = logger;
            _settings = settings;
        }

        public async Task<string> GenerateKeyPair(Blockchain blockchain)
        {
            var crypto = MapBlockchainToCrypto(blockchain);
            var model = new CreateSigningPairRequest(LABELPARTNERCODE, crypto);

            var response = await _httpClient.PostAsJsonAsync
                ($"CreateSigningPair?code={_settings.CreateSigningPairKey}", model);

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger?.LogError("CreateSigningPair returned {statusCode} response: {content}", response.StatusCode, json);
                throw new CustomErrorsException("SigningServiceError", blockchain.ToString(), $"An {response.StatusCode} error occured creating a new signing pair: {json}");
            }

            var content = JsonSerializer.Deserialize<CreateSigningPairResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (content == null)
            {
                _logger?.LogError("Unable to parse CreateSigningPair response to JSON");
                throw new CustomErrorsException("SigningServiceError", blockchain.ToString(), "An error occured creating a new signing pair");
            }

            return content.PublicKey;
        }

        public async Task<string> Sign(SignRequest request)
        {
            var crypto = MapBlockchainToCrypto(request.Blockchain);
            var model = new CreateSignatureRequest
                (LABELPARTNERCODE, crypto, new string[] { request.PublicKey }, request.TransactionEnvelope, _settings.StellarNetworkPassphrase);

            var response = await _httpClient.PostAsJsonAsync
                ($"CreateSignature?code={_settings.CreateSignatureKey}", model);

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger?.LogError("CreateSignature returned {statusCode} response: {content}", response.StatusCode, json);
                throw new CustomErrorsException("SigningServiceError", request.Blockchain.ToString(), $"An {response.StatusCode} error occured signing the transaction: {json}");
            }

            var content = JsonSerializer.Deserialize<CreateSignatureResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (content == null)
            {
                _logger?.LogError("Unable to parse CreateSignature response to JSON");
                throw new CustomErrorsException("SigningServiceError", request.Blockchain.ToString(), "An error occured signing the transaction");
            }

            return content.SignedTransactionEnvelope;
        }

        private static string MapBlockchainToCrypto(Blockchain blockchain) => blockchain switch
        {
            Blockchain.STELLAR => "XLM",
            Blockchain.ALGORAND => "ALGO",
            _ => throw new NotSupportedException()
        };

        private record CreateSigningPairRequest(string LabelPartnerCode, string Crypto);
        private record CreateSigningPairResponse(string PublicKey);

        private record CreateSignatureRequest(string LabelPartnerCode, string Crypto, string[] Signers, string ToBeSignedTransactionEnvelope, string? NetworkPassphrase);
        private record CreateSignatureResponse(string SignedTransactionEnvelope);
    }
}
