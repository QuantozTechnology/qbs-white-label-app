// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SigningService.API.BLL;
using SigningService.API.Extensions;
using SigningService.API.Models.Requests;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SigningService.API.Functions;

public class CreateSignature
{
    private readonly ISigningPairLogic _signingPairLogic;

    public CreateSignature(
        ISigningPairLogic signingPairLogic)
    {
        _signingPairLogic = signingPairLogic;
    }

    [Function("CreateSignature")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "CreateSignature")] HttpRequestData req, FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("HttpFunction");

        logger.LogInformation("CreateSignature.Run function processed a request at {0}.", DateTime.UtcNow);

        var requestModel = await req.ReadFromJsonAsync<CreateSignatureRequestModel>();

        if (string.IsNullOrWhiteSpace(requestModel.Crypto))
        {
            return await req.BadRequestAsync("CryptoRequired");
        }

        if (string.IsNullOrWhiteSpace(requestModel.LabelPartnerCode))
        {
            return await req.BadRequestAsync("LabelPartnerRequired");
        }

        if (!requestModel.Signers.Any())
        {
            return await req.BadRequestAsync("SignerRequired");
        }

        if (string.IsNullOrEmpty(requestModel.ToBeSignedTransactionEnvelope))
        {
            return await req.BadRequestAsync("TransactionEnvelopeRequired");
        }

        // check whether the crypto support tokenization
        if (!(Enum.TryParse<AllowedCryptos>(requestModel.Crypto, true, out var crypto) && Enum.IsDefined(typeof(AllowedCryptos), crypto)))
        {
            return await req.BadRequestAsync("CryptoRequired");
        }

        if (crypto == AllowedCryptos.XLM && string.IsNullOrEmpty(requestModel.NetworkPassphrase))
        {
            return await req.BadRequestAsync("NetworkPassphraseRequired");
        }

        var signedTransactionEnvelope = _signingPairLogic.CreateSignature(requestModel);

        if (signedTransactionEnvelope.IsFailed)
        {
            return await req.BadRequestAsync($"{signedTransactionEnvelope.Errors.FirstOrDefault()?.Message}");
        }

        return await req.Ok(signedTransactionEnvelope.Value);
    }
}
