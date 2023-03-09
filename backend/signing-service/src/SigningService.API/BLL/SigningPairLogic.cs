// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Algorand;
using FluentResults;
using stellar_dotnet_sdk;
using SigningService.HDWallet;
using SigningService.API.Repository;
using SigningService.API.Models.Responses;
using SigningService.API.Models.Requests;
using SigningService.API.Models.Projection;

namespace SigningService.API.BLL;

public class SigningPairLogic : ISigningPairLogic
{
    private readonly ISigningPairRepository _signingPairRepository;
    private readonly IWallet _wallet;
    private readonly ILogger _logger;

    public SigningPairLogic(ISigningPairRepository signingPairRepository,
        IWallet wallet, ILogger<SigningPairLogic> logger)
    {
        _signingPairRepository = signingPairRepository;
        _wallet = wallet;
        _logger = logger;
    }

    public Result<SigningPairResponseModel> CreateSigningPair(AllowedCryptos crypto, string labelPartnerCode)
    {
        var success = false;
        SigningPairDTO signingPair;
        WalletKeyPair keyPair = null;

        // generate keypairs using mnemonic
        _logger.LogInformation("Get mnemonic and password from KeyVault");
        var index = _signingPairRepository.GetNextHDIndex(crypto.ToString(), labelPartnerCode);
        var secrets = _wallet.GetSecrets(crypto.ToString(), labelPartnerCode);

        if (secrets == null)
        {
            return Result.Fail<SigningPairResponseModel>("Wallet secrets from Azure KeyVault are null");
        }

        if (string.IsNullOrWhiteSpace(secrets.Password) || string.IsNullOrWhiteSpace(secrets.Mnemonic))
        {
            return Result.Fail<SigningPairResponseModel>("Password or mnemonic from Azure KeyVault are invalid");
        }

        var seed = HDWallet.HDWallet.GenerateSeed(secrets.Mnemonic, secrets.Password);
        var wallet = HDWallet.HDWallet.FromSeed(seed);

        var retries = 0;

        while (!success && retries < 10)
        {
            keyPair = wallet.GetKeyPair(index, crypto.ToString());

            if (keyPair == null)
            {
                _logger.LogError("Could not generate a random KeyPair for {crypto}", crypto);
                break;
            }

            _logger.LogInformation("New keypair is generated with index-{index} and public key-{publicKey}", index, keyPair.PublicKey);

            // We do not encrypt the private key, because the key pair can be later on be re-generated using the seed, password and index
            signingPair = new SigningPairDTO()
            {
                CreatedOn = DateTime.UtcNow,
                CryptoCode = crypto.ToString(),
                Index = index,
                LabelPartnerCode = labelPartnerCode,
                PublicKey = keyPair.PublicKey
            };

            try
            {
                _signingPairRepository.CreateSigningpairPerAllowedCrypto(signingPair);
                success = true;
            }
            catch
            {
                success = false;
                retries++;
                if (retries > 4)
                {
                    // if we've hit this many retries, there are likely multiple concurrent requests
                    // As such we increment the index by a random amount.
                    var rnd = new Random();
                    #pragma warning disable SCS0005 // Weak random number generator.
                    index += rnd.Next(2, 6);
                    #pragma warning restore SCS0005 // Weak random number generator.
                }
                else
                {
                    index++;
                }
            }
        }

        if (!success || keyPair == null)
        {
            _logger.LogError($"Failed to generate SigningPair after 10 retries");
            return Result.Fail<SigningPairResponseModel>("Failed to generate new public-private keypair");
        }

        return Result.Ok(new SigningPairResponseModel { PublicKey = keyPair.PublicKey });
    }

    public Result<SignatureResponseModel> CreateSignature(CreateSignatureRequestModel signingRequest)
    {
        if (signingRequest == null)
        {
            throw new Exception("Requested object cannot be null.");
        }

        if (!signingRequest.Signers.Any())
        {
            return Result.Fail<SignatureResponseModel>("SignerIsRequired");
        }

        if (string.IsNullOrWhiteSpace(signingRequest.ToBeSignedTransactionEnvelope))
        {
            return Result.Fail<SignatureResponseModel>("ToBeSignedTransactionEnvelopeCannotBeNull");
        }

        if (!(Enum.TryParse<AllowedCryptos>(signingRequest.Crypto, true, out var crypto) && Enum.IsDefined(typeof(AllowedCryptos), crypto)))
        {
            return Result.Fail<SignatureResponseModel>("CryptoDoesnotSupportTokenization");
        }

        return crypto switch
        {
            AllowedCryptos.XLM => SignStellarTransaction(signingRequest),
            AllowedCryptos.ALGO => SignAlgorandTransaction(signingRequest),
            _ => throw new NotImplementedException(),
        };
    }

    public Result GenerateMnemonic(GenerateMnemonicModel generateMnemonic)
    {
        var mnemonic = HDWallet.HDWallet.GenerateMnemonic();

        var passwordBytes = RandomNumberGenerator.GetBytes(64);
        var seedPassword = Convert.ToBase64String(passwordBytes);
        var secrets = new WalletSecrets(mnemonic, seedPassword);

        var success = _wallet.StoreSecrets(generateMnemonic.Crypto, generateMnemonic.LabelPartnerCode, secrets);

        if (!success)
        {
            return Result.Fail("An error occured storing the secrets in the key vault or it already exists");
        }

        return Result.Ok();
    }

    private Result<SignatureResponseModel> SignStellarTransaction(CreateSignatureRequestModel signingRequest)
    {
        var model = new CreateSignatureModel
        {
            SigningPairs = new List<SigningPairDTO>(),
            ToBeSignedTransactionEnvelope = signingRequest.ToBeSignedTransactionEnvelope,
            LabelPartnerCode = signingRequest.LabelPartnerCode,
            Crypto = signingRequest.Crypto
        };

        try
        {
            model.Network = new Network(signingRequest.NetworkPassphrase);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Exception occured parsing network passphrase: {network}", signingRequest.NetworkPassphrase);
            return Result.Fail<SignatureResponseModel>("Invalid network passphrase");
        }

        // check whether the signers exist in SigningPair table
        foreach (var signer in signingRequest.Signers)
        {
            var signingPairDTO = _signingPairRepository.GetSigningPair(signer);

            if (signingPairDTO == null)
            {
                return Result.Fail<SignatureResponseModel>("SigningPairNotFound");
            }

            if (!string.IsNullOrEmpty(signingPairDTO.CryptoCode) && signingPairDTO.CryptoCode != signingRequest.Crypto)
            {
                return Result.Fail<SignatureResponseModel>("Mismatched Crypto");
            }

            if (!string.IsNullOrEmpty(signingPairDTO.LabelPartnerCode) && signingPairDTO.LabelPartnerCode != signingRequest.LabelPartnerCode)
            {
                return Result.Fail<SignatureResponseModel>("Mismatched LabelPartnerCode");
            }

            model.SigningPairs.Add(signingPairDTO);
        }

        string signedTransactionEnvelope;

        // sign the envelope
        if (signingRequest.IsFeeBumpTransaction)
        {
            var signatureResult = CreateStellarFeeBumpSignature(model);

            if (signatureResult.IsFailed)
            {
                return signatureResult.ToResult();
            }

            signedTransactionEnvelope = signatureResult.Value.ToEnvelopeXdrBase64();
        }
        else
        {
            var signatureResult = CreateStellarSignature(model);

            if (signatureResult.IsFailed)
            {
                return signatureResult.ToResult();
            }

            signedTransactionEnvelope = signatureResult.Value.ToEnvelopeXdrBase64();
        }

        return Result.Ok(
            new SignatureResponseModel { SignedTransactionEnvelope = signedTransactionEnvelope });
    }

    private Result<SignatureResponseModel> SignAlgorandTransaction(CreateSignatureRequestModel signingRequest)
    {
        var model = new CreateSignatureModel
        {
            SigningPairs = new List<SigningPairDTO>(),
            ToBeSignedTransactionEnvelope = signingRequest.ToBeSignedTransactionEnvelope,
            Crypto = signingRequest.Crypto,
            LabelPartnerCode = signingRequest.LabelPartnerCode
        };

        // check whether the signers exist in SigningPair table
        foreach (var signer in signingRequest.Signers)
        {
            var signingPairDTO = _signingPairRepository.GetSigningPair(signer);

            if (signingPairDTO == null)
            {
                return Result.Fail<SignatureResponseModel>("SigningPairNotFound");
            }

            if (!string.IsNullOrEmpty(signingPairDTO.CryptoCode) && signingPairDTO.CryptoCode != signingRequest.Crypto)
            {
                return Result.Fail<SignatureResponseModel>("Mismatched Crypto");
            }

            if (!string.IsNullOrEmpty(signingPairDTO.LabelPartnerCode) && signingPairDTO.LabelPartnerCode != signingRequest.LabelPartnerCode)
            {
                return Result.Fail<SignatureResponseModel>("Mismatched LabelPartnerCode");
            }

            model.SigningPairs.Add(signingPairDTO);
        }

        if (model.SigningPairs.Count > 1)
        {
            return Result.Fail<SignatureResponseModel>("OnlyOneSignerSupportedForAlogrand");
        }

        var signatureResult = CreateAlgorandSignature(model);

        if (signatureResult.IsFailed)
        {
            return signatureResult.ToResult();
        }

        var signedTransactionEnvelope = Convert.ToBase64String(Encoder.EncodeToMsgPack(signatureResult.Value));

        return Result.Ok(new SignatureResponseModel { SignedTransactionEnvelope = signedTransactionEnvelope });
    }

    private Result<stellar_dotnet_sdk.Transaction> CreateStellarSignature(CreateSignatureModel model)
    {
        // retrieve the tx obj from the envelope
        stellar_dotnet_sdk.Transaction tx;

        try
        {
            tx = stellar_dotnet_sdk.Transaction.FromEnvelopeXdr(model.ToBeSignedTransactionEnvelope);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed parsing Stellar Envelope: {envelope}", model.ToBeSignedTransactionEnvelope);
            return Result.Fail("Failed parsing Stellar envelope");
        }

        foreach (var signer in model.SigningPairs)
        {
            var privateKeyResult = GetDecryptedPrivateKey(signer, model.Crypto);

            if (privateKeyResult.IsFailed)
            {
                return privateKeyResult.ToResult();
            }

            tx.Sign(KeyPair.FromSecretSeed(privateKeyResult.Value), model.Network);
        }

        return tx;
    }

    private Result<FeeBumpTransaction> CreateStellarFeeBumpSignature(CreateSignatureModel model)
    {
        FeeBumpTransaction tx;

        try
        {
            tx = FeeBumpTransaction.FromEnvelopeXdr(model.ToBeSignedTransactionEnvelope);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed parsing Stellar Envelope: {envelope}", model.ToBeSignedTransactionEnvelope);
            return Result.Fail("Failed parsing Stellar feebump envelope");
        }

        foreach (var signer in model.SigningPairs)
        {
            var privateKeyResult = GetDecryptedPrivateKey(signer, model.Crypto);

            if (privateKeyResult.IsFailed)
            {
                return privateKeyResult.ToResult();
            }

            tx.Sign(KeyPair.FromSecretSeed(privateKeyResult.Value), model.Network);
        }

        return tx;
    }

    private Result<string> GetDecryptedPrivateKey(SigningPairDTO signer, string cryptoCode)
    {
        string decryptedPrivateKey;

        if (signer.Index != null)
        {
            var walletSecrets = _wallet.GetSecrets(signer.CryptoCode, signer.LabelPartnerCode);

            if (walletSecrets == null)
            {
                return Result.Fail($"Could not retrieve wallet settings for the provided public key: {signer.PublicKey}");
            }

            _logger.LogInformation("Sign the transaction envelope by Hd Wallet for the public key: {publicKey}", signer.PublicKey);

            var seed = HDWallet.HDWallet.GenerateSeed(walletSecrets.Mnemonic, walletSecrets.Password);
            var wallet = HDWallet.HDWallet.FromSeed(seed);

            var walletKeyPair = wallet.GetKeyPair(signer.Index.Value, cryptoCode);

            if (walletKeyPair.PublicKey != signer.PublicKey)
            {
                _logger.LogError("Hd Wallet retrieved wrong private key for the public key: {publicKey}", signer.PublicKey);
                return Result.Fail($"Could not retrieve key pair for the provided public key: {signer.PublicKey}");
            }

            decryptedPrivateKey = walletKeyPair.PrivateKey;
            _logger.LogInformation("Retrieval of the private key was successful for the public key: {publicKey}", signer.PublicKey);
        }
        else
        {
            _logger.LogError("Either Index or Private key must be not null for the public key: {publicKey}", signer.PublicKey);
            return Result.Fail($"Private key cannot be retrieved for the public key: {signer.PublicKey}");
        }

        return decryptedPrivateKey;
    }

    private Result<SignedTransaction> CreateAlgorandSignature(CreateSignatureModel model)
    {
        Algorand.Transaction tx;

        try
        {
            tx = Encoder.DecodeFromMsgPack<Algorand.Transaction>(Convert.FromBase64String(model.ToBeSignedTransactionEnvelope));
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed parsing Algorand Transaction");
            return null;
        }

        SignedTransaction signedTx = null;

        foreach (var signer in model.SigningPairs)
        {
            var privateKeyResult = GetDecryptedPrivateKey(signer, model.Crypto);

            if (privateKeyResult.IsFailed)
            {
                return privateKeyResult.ToResult();
            }

            var account = new Algorand.Account(privateKeyResult.Value);
            signedTx = account.SignTransaction(tx);
        }

        return signedTx;
    }
}
