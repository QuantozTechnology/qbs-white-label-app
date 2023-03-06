using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using SigningService.API.BLL;
using SigningService.API.Data;
using SigningService.API.Functions;
using SigningService.API.Models.Requests;
using SigningService.API.Models.Responses;
using SigningService.API.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace SigningService.API.Tests;

public record FunctionEnvironment(SigningDbContext SigningDb, CreateSigningPair CreateSigningPairFunction, CreateSignature CreateSignatureFunction, GenerateMnemonic GenerateMnemonicFunction);

public class IntegrationTests : IDisposable
{
    private SqliteConnection _connection;

    private enum WalletType
    {
        DefaultWallet,
        MnemonicWallet,
        KeyvaultWallet
    }

    private FunctionEnvironment Setup(WalletType walletType)
    {
        // Create and open a connection. This creates the SQLite in-memory database, which will persist until the connection is closed
        // at the end of the test (see Dispose below).
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var dbOptions = new DbContextOptionsBuilder<SigningDbContext>()
          .UseSqlite(_connection)
          .EnableSensitiveDataLogging()
          .UseLazyLoadingProxies()
          .Options;

        var db = new SigningDbContext(dbOptions);

        db.Database.EnsureCreated();

        var walletOptions = Options.Create(new WalletOptions { KeyVaultUrl = null });

        var host = new HostBuilder()
            .ConfigureWebJobs(builder =>
            {
                // configure in memory database
                builder.Services.AddDbContext<SigningDbContext>(o => o.UseSqlite(_connection));

                // configure options
                builder.Services.AddSingleton(walletOptions);

                // configure signing service classes
                builder.Services.AddScoped<ISigningPairRepository, SigningPairRepository>();
                builder.Services.AddScoped<ISigningPairLogic, SigningPairLogic>();
                switch (walletType)
                {
                    case WalletType.DefaultWallet:
                        builder.Services.AddScoped<IWallet, FailWallet>();
                        break;
                    case WalletType.MnemonicWallet:
                        builder.Services.AddScoped<IWallet, MnemonicWallet>();
                        break;
                    case WalletType.KeyvaultWallet:
                        builder.Services.AddScoped<IWallet, KeyVaultWallet>();
                        break;
                    default:
                        builder.Services.AddScoped<IWallet, FailWallet>();
                        break;
                }
            })
            .Build();

        var signingPairLogic = host.Services.GetRequiredService<ISigningPairLogic>();

        var spFunction = new CreateSigningPair(signingPairLogic);
        var sigFunction = new CreateSignature(signingPairLogic);
        var mnFunction = new GenerateMnemonic(host.Services.GetRequiredService<ISigningPairLogic>());

        return new FunctionEnvironment(db, spFunction, sigFunction, mnFunction);
    }

    [Fact]
    public async Task CreateSigningPair_BadRequest_CryptoCurrencyRequired()
    {
        var functions = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSigningPairModel()
        {
            Crypto = null,
            LabelPartnerCode = "LP1"
        });

        var result = await functions.CreateSigningPairFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("CryptoCurrencyRequired", badRequest.Value);
    }

    [Fact]
    public async Task CreateSigningPair_BadRequest_CryptoCurrencyInvalid()
    {
        var functions = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSigningPairModel()
        {
            Crypto = "BLA",
            LabelPartnerCode = "LP1"
        });

        var result = await functions.CreateSigningPairFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("CryptoCurrencyInvalid", badRequest.Value);
    }

    [Fact]
    public async Task CreateSigningPair_BadRequest_LabelPartnerRequired()
    {
        var functions = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSigningPairModel()
        {
            Crypto = "XLM",
            LabelPartnerCode = null
        });

        var result = await functions.CreateSigningPairFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("LabelPartnerRequired", badRequest.Value);
    }

    [Fact]
    public async Task GenerateMnemonic_BadRequest_CryptoCurrencyRequired()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new GenerateMnemonicModel()
        {
            Crypto = null,
            LabelPartnerCode = "LP1"
        });

        var result = await env.GenerateMnemonicFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("CryptoCurrencyRequired", badRequest.Value);
    }

    [Fact]
    public async Task GenerateMnemonic_BadRequest_CryptoCurrencyInvalid()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new GenerateMnemonicModel()
        {
            Crypto = "BLA",
            LabelPartnerCode = "LP1"
        });

        var result = await env.GenerateMnemonicFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("CryptoCurrencyInvalid", badRequest.Value);
    }

    [Fact]
    public async Task GenerateMnemonic_BadRequest_LabelPartnerRequired()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new GenerateMnemonicModel()
        {
            Crypto = "ALGO",
            LabelPartnerCode = null
        });

        var result = await env.GenerateMnemonicFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("LabelPartnerRequired", badRequest.Value);
    }

    [Fact]
    public async Task CreateSignatureFunction_BadRequest_CryptoCurrencyRequired()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSignatureRequestModel()
        {
            Crypto = null,
            LabelPartnerCode = "LP1",
            NetworkPassphrase = "Passphrase",
            Signers = new string[] { "signer1" },
            ToBeSignedTransactionEnvelope = "envelope"
        });

        var result = await env.CreateSignatureFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("CryptoCurrencyRequired", badRequest.Value);
    }

    [Fact]
    public async Task CreateSignatureFunction_BadRequest_CryptoCurrencyInvalid()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSignatureRequestModel()
        {
            Crypto = "BLA",
            LabelPartnerCode = "LP1",
            NetworkPassphrase = "Passphrase",
            Signers = new string[] { "signer1" },
            ToBeSignedTransactionEnvelope = "envelope"
        });

        var result = await env.CreateSignatureFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("CryptoCurrencyInvalid", badRequest.Value);
    }

    [Fact]
    public async Task CreateSignatureFunction_BadRequest_LabelPartnerRequired()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSignatureRequestModel()
        {
            Crypto = "XLM",
            LabelPartnerCode = null,
            NetworkPassphrase = "Passphrase",
            Signers = new string[] { "signer1" },
            ToBeSignedTransactionEnvelope = "envelope"
        });

        var result = await env.CreateSignatureFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("LabelPartnerRequired", badRequest.Value);
    }

    [Fact]
    public async Task CreateSignatureFunction_BadRequest_TransactionEnvelopeRequired()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSignatureRequestModel()
        {
            Crypto = "XLM",
            LabelPartnerCode = "LP1",
            NetworkPassphrase = "Passphrase",
            Signers = new string[] { "signer1" },
            ToBeSignedTransactionEnvelope = null
        });

        var result = await env.CreateSignatureFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("TransactionEnvelopeRequired", badRequest.Value);
    }

    [Fact]
    public async Task CreateSignatureFunction_BadRequest_SignerRequired()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSignatureRequestModel()
        {
            Crypto = "XLM",
            LabelPartnerCode = "LP1",
            NetworkPassphrase = "Passphrase",
            Signers = Array.Empty<string>(),
            ToBeSignedTransactionEnvelope = "envelope"
        });

        var result = await env.CreateSignatureFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("SignerRequired", badRequest.Value);
    }

    [Fact]
    public async Task CreateSignatureFunction_BadRequest_NetworkPassphraseRequired()
    {
        var env = Setup(WalletType.DefaultWallet);

        var req = BuildPostRequest(new CreateSignatureRequestModel()
        {
            Crypto = "XLM",
            LabelPartnerCode = "LP1",
            NetworkPassphrase = null,
            Signers = new string[] { "signer1" },
            ToBeSignedTransactionEnvelope = "envelope"
        });

        var result = await env.CreateSignatureFunction.Run(req, NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<BadRequestObjectResult>(result);

        var badRequest = result as BadRequestObjectResult;
        Assert.Equal("NetworkPassphraseRequired", badRequest.Value);
    }

    [Fact]
    public async void Fel_Test_Using_Mnemomic()
    {
        var env = Setup(WalletType.MnemonicWallet);

        // Create and store new mnemonic (and password)
        var generateMnemonicModel = new GenerateMnemonicModel()
        {
            Crypto = "ALGO",
            LabelPartnerCode = "LP1"
        };

        var generateMnemonicResult = await env.GenerateMnemonicFunction.Run(BuildPostRequest(generateMnemonicModel), NullLogger<GenerateMnemonic>.Instance);

        Assert.IsType<OkResult>(generateMnemonicResult);

        var db = env.SigningDb;

        Assert.Empty(db.SigningPairs);

        // Create new SigningPair using the mnemonic
        var createSigningPairModel = new CreateSigningPairModel()
        {
            Crypto = "ALGO",
            LabelPartnerCode = "LP1"
        };

        var createSigningPairResult = await env.CreateSigningPairFunction.Run(BuildPostRequest(createSigningPairModel), NullLogger<CreateSigningPair>.Instance);

        Assert.IsType<OkObjectResult>(createSigningPairResult);

        Assert.Single(db.SigningPairs);

        var signingPair = db.SigningPairs.First();

        // Mnemonic should be used, indicated by the Index existing
        Assert.NotNull(signingPair.Index);

        var publicKey = signingPair.PublicKey;

        // Create a valid transaction
        var fromAddress = new Algorand.Address(publicKey);
        var toAddress = new Algorand.Address("R7EHBRD73PSV2P3KYUAZ6U4ULLVNN4LEEBXP6L2HFQ52G7VNHXEPH3MNGM");
        var transaction = new Algorand.Transaction(fromAddress, toAddress, 1000, 1000000, 17665783, 17666783);
        var unsignedTx = Convert.ToBase64String(Algorand.Encoder.EncodeToMsgPack(transaction));

        // Sign transaction
        var createSignatureModel = new CreateSignatureRequestModel()
        {
            Crypto = "ALGO",
            LabelPartnerCode = "LP1",
            Signers = new List<string>() { publicKey },
            ToBeSignedTransactionEnvelope = unsignedTx
        };

        var createSignatureResult = await env.CreateSignatureFunction.Run(BuildPostRequest(createSignatureModel), NullLogger<CreateSignature>.Instance);

        // Validate success
        Assert.IsType<OkObjectResult>(createSignatureResult);

        var response = (SignatureResponseModel)((OkObjectResult)createSignatureResult).Value;
        var signedTx = response.SignedTransactionEnvelope;

        Assert.NotEqual(unsignedTx, signedTx);

        var decodedSignedTx = Algorand.Encoder.DecodeFromMsgPack<Algorand.SignedTransaction>(Convert.FromBase64String(signedTx));

        // Validate we didn't return a wrong transaction
        Assert.Equal(transaction.TxID(), decodedSignedTx.tx.TxID());
        // Validate it was also signed
        Assert.False(decodedSignedTx.sig.Bytes.All(x => x == 0));
    }

    private static HttpRequestMessage BuildPostRequest<T>(T model)
    {
        var json = JsonSerializer.Serialize(model);

        var req = new HttpRequestMessage
        {
            Method = HttpMethod.Post,
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        return req;
    }

    public void Dispose()
    {
        _connection?.Dispose();

        GC.SuppressFinalize(this);
    }
}
