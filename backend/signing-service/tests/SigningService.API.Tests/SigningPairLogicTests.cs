// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using dotnetstandard_bip39;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SigningService.API.BLL;
using SigningService.API.Data;
using SigningService.API.Models.Requests;
using SigningService.API.Repository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace SigningService.API.Tests;

public class SigningPairLogicTests
{
    private readonly ITestOutputHelper _output;
    private static async Task<ISigningPairRepository> SetupRepo()
    {
        var connectionStringBuilder = new SqliteConnectionStringBuilder { DataSource = ":memory:" };
        var connectionString = connectionStringBuilder.ToString();
        var connection = new SqliteConnection(connectionString);
        connection.Open();

        var dbOptions = new DbContextOptionsBuilder<SigningDbContext>()
          .UseSqlite(connection)
          .EnableSensitiveDataLogging()
          .Options;

        var db = new SigningDbContext(dbOptions);

        await db.Database.EnsureCreatedAsync();

        return new SigningPairRepository(db);
    }

    public SigningPairLogicTests(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public async Task SignAlgorandTransactionOffline_SigningPairNotFound()
    {
        var wallet = new FailWallet();
        var repo = await SetupRepo();

        var logic = new SigningPairLogic(repo, wallet, NullLogger<SigningPairLogic>.Instance);

        var fromAddress = new Algorand.Address("3FAQ2KDXXDSYZVTXHUI5T4IBQ5W5TY3QAOTCJZ6XHB7Q7DBHIHLJKMIWCU");
        var toAddress = new Algorand.Address("R7EHBRD73PSV2P3KYUAZ6U4ULLVNN4LEEBXP6L2HFQ52G7VNHXEPH3MNGM");
        var transaction = new Algorand.Transaction(fromAddress, toAddress, 1000, 1000000, 17665783, 17666783);
        var src = "auction siege catalog remain typical master grow trial thumb special crawl purchase pencil stand oil atom program slender jungle dentist melody sibling draft above midnight";
        var srcAcc = new Algorand.Account(src);
        var signedTx = srcAcc.SignTransaction(transaction);
        var encodedTx = Algorand.Encoder.EncodeToJson(signedTx);

        var createSignatureResult = logic.CreateSignature(new CreateSignatureRequestModel
        {
            Crypto = "ALGO",
            IsFeeBumpTransaction = false,
            NetworkPassphrase = null,
            Signers = new[] { srcAcc.Address.EncodeAsString() },
            ToBeSignedTransactionEnvelope = Algorand.Encoder.EncodeToJson(transaction)
        });

        Assert.False(createSignatureResult.IsSuccess);
        Assert.Contains(createSignatureResult.Errors, e => e.Message == "SigningPairNotFound");
    }

    [Fact]
    public void SignBatchedAlgorandTransaction()
    {
        var fromAddress = new Algorand.Address("3FAQ2KDXXDSYZVTXHUI5T4IBQ5W5TY3QAOTCJZ6XHB7Q7DBHIHLJKMIWCU");
        var fromAddress2 = new Algorand.Address("R7EHBRD73PSV2P3KYUAZ6U4ULLVNN4LEEBXP6L2HFQ52G7VNHXEPH3MNGM");
        var toAddress = new Algorand.Address("G47IBQ4NMR6LXHDZHV6GWIEIKAVV4K4T3EKEHMU5POUKKPK2C5YKV5XNIQ");
        var transaction = new Algorand.Transaction(fromAddress, toAddress, 1000, 1000000, 17665783, 17666783);
        var transaction2 = new Algorand.Transaction(fromAddress2, toAddress, 1000, 1000000, 17665783, 17666783);
        var src = "auction siege catalog remain typical master grow trial thumb special crawl purchase pencil stand oil atom program slender jungle dentist melody sibling draft above midnight";
        var srcAcc = new Algorand.Account(src);
        var src2 = "roast tide couch copper option rug dash off dumb plug lock laptop lady ice circle year find bachelor old absorb midnight size area abstract welcome";
        var srcAcc2 = new Algorand.Account(src2);

        var preBatchSig = srcAcc.SignTransaction(transaction);
        var preBatchSig2 = srcAcc2.SignTransaction(transaction2);

        var batchedTx = Algorand.TxGroup.AssignGroupID(new Algorand.Transaction[] { transaction, transaction2 });

        var encoded = Algorand.Encoder.EncodeToJson(batchedTx);
        var decoded = Algorand.Encoder.DecodeFromJson<Algorand.Transaction[]>(encoded);

        Assert.Equal(batchedTx, decoded);

        var msgPackEncoded = Algorand.Encoder.EncodeToMsgPack(batchedTx);
        var msgPackDecoded = Algorand.Encoder.DecodeFromMsgPack<Algorand.Transaction[]>(msgPackEncoded);

        Assert.Equal(batchedTx, msgPackDecoded);

        var base64Encoded = Convert.ToBase64String(msgPackEncoded);
        var base64Decoded = Convert.FromBase64String(base64Encoded);

        Assert.Equal(msgPackEncoded, base64Decoded);

        var msgPackFromBase64Decoded = Algorand.Encoder.DecodeFromMsgPack<Algorand.Transaction[]>(base64Decoded);

        Assert.Equal(batchedTx, msgPackFromBase64Decoded);

        var postBatchSig = srcAcc.SignTransaction(transaction);
        var postBatchSig2 = srcAcc2.SignTransaction(transaction2);

        Assert.NotEqual(preBatchSig, postBatchSig);
        Assert.NotEqual(preBatchSig2, postBatchSig2);

        var signedBatchTx = new Algorand.SignedTransaction[] { postBatchSig, postBatchSig2 };

        var encodedSig = Algorand.Encoder.EncodeToJson(signedBatchTx);
        var decodedSig = Algorand.Encoder.DecodeFromJson<Algorand.SignedTransaction[]>(encodedSig);

        Assert.Equal(signedBatchTx, decodedSig);

        // Assuming that transaction is the one that pays the fee and transaction2 is signed by the customer
        var base64EncodedTx2 = Convert.ToBase64String(Algorand.Encoder.EncodeToMsgPack(transaction2));
        var decodedTx2 = Algorand.Encoder.DecodeFromMsgPack<Algorand.Transaction>(Convert.FromBase64String(base64EncodedTx2));

        var decodedTx2Signed = srcAcc2.SignTransaction(decodedTx2);
        var decodedTx2Signature = decodedTx2Signed.sig;

        var base64EncodedTx2Sig = Convert.ToBase64String(decodedTx2Signature.Bytes);
        var base64DecodedTx2Sig = new Algorand.Signature(Convert.FromBase64String(base64EncodedTx2Sig));

        Assert.Equal(decodedTx2Signature, base64DecodedTx2Sig);

        var offlineSignedTx2 = new Algorand.SignedTransaction(transaction2, base64DecodedTx2Sig, transaction2.TxID());

        var feeBumpSignedBatch = new Algorand.SignedTransaction[] { postBatchSig, offlineSignedTx2 };

        Assert.Equal(signedBatchTx, feeBumpSignedBatch);
    }

    [Fact]
    public void TestSigningPairs()
    {
        var wallet = new MnemonicWallet();
        var (mnemonic, password) = wallet.GetSecrets(null, null);
        var seed = HDWallet.HDWallet.GenerateSeed(mnemonic, password);
        var hdWallet = HDWallet.HDWallet.FromSeed(seed);

        var algorandKeyPair = hdWallet.GetKeyPair(1, "ALGO");
        Assert.Equal(algorandKeyPair.PublicKey, new Algorand.Account(algorandKeyPair.PrivateKey).Address.EncodeAsString());
        var stellarKeyPair = hdWallet.GetKeyPair(2, "XLM");
        Assert.Equal(stellarKeyPair.PublicKey, stellar_dotnet_sdk.KeyPair.FromSecretSeed(stellarKeyPair.PrivateKey).AccountId);
    }

    [Fact]
    public async Task TestLabelPartnerSigningPairs()
    {
        var wallet = new MnemonicWallet();
        var repo = await SetupRepo();

        var logic = new SigningPairLogic(repo, wallet, NullLogger<SigningPairLogic>.Instance);
        var addResult = logic.CreateSigningPair(AllowedCryptos.ALGO, "LP1");
        Assert.True(addResult.IsSuccess);

        var fromPubKey = addResult.Value.PublicKey;

        var fromAddress = new Algorand.Address(fromPubKey);
        var toAddress = new Algorand.Address("R7EHBRD73PSV2P3KYUAZ6U4ULLVNN4LEEBXP6L2HFQ52G7VNHXEPH3MNGM");
        var transaction = new Algorand.Transaction(fromAddress, toAddress, 1000, 1000000, 17665783, 17666783);

        var signResult = logic.CreateSignature(new CreateSignatureRequestModel()
        {
            Crypto = "ALGO",
            LabelPartnerCode = "LP1",
            Signers = new List<string>() { addResult.Value.PublicKey },
            ToBeSignedTransactionEnvelope = Convert.ToBase64String(Algorand.Encoder.EncodeToMsgPack(transaction))
        });

        Assert.True(signResult.IsSuccess);

        var signResultWrongLP = logic.CreateSignature(new CreateSignatureRequestModel()
        {
            Crypto = "ALGO",
            LabelPartnerCode = "LP2",
            Signers = new List<string>() { addResult.Value.PublicKey },
            ToBeSignedTransactionEnvelope = Convert.ToBase64String(Algorand.Encoder.EncodeToMsgPack(transaction))
        });

        Assert.False(signResultWrongLP.IsSuccess);
        Assert.Contains(signResultWrongLP.Errors, x => x.Message == "Mismatched LabelPartnerCode");

        var signResultWrongCrypto = logic.CreateSignature(new CreateSignatureRequestModel()
        {
            Crypto = "XLM",
            LabelPartnerCode = "LP1",
            Signers = new List<string>() { addResult.Value.PublicKey },
            ToBeSignedTransactionEnvelope = Convert.ToBase64String(Algorand.Encoder.EncodeToMsgPack(transaction)),
            NetworkPassphrase = "Stellar Test"
        });

        Assert.False(signResultWrongCrypto.IsSuccess);
        Assert.Contains(signResultWrongCrypto.Errors, x => x.Message == "Mismatched Crypto");
    }

    [Fact]
    public async Task TestGenerateMnemonic()
    {
        var wallet = new FailWallet();
        var repo = await SetupRepo();

        var logic = new SigningPairLogic(repo, wallet, NullLogger<SigningPairLogic>.Instance);

        var result = logic.GenerateMnemonic(new GenerateMnemonicModel() { Crypto = "ALGO", LabelPartnerCode = "LP1" });
        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void TestRandomMnemonics()
    {
        var bip39 = new BIP39();
        var mnemonic = bip39.GenerateMnemonic(160, BIP39Wordlist.English);

        Assert.True(bip39.ValidateMnemonic(mnemonic, BIP39Wordlist.English));
    }
}
